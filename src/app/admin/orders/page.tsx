"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeTab !== "all") params.set("status", activeTab);

    fetch(`/api/admin/orders?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrders(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeTab]);

  async function handleRefund(orderId: string) {
    if (!confirm("确定退款？退款金额将退回用户钱包。")) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/refund`, { method: "PUT" });
      const data = await res.json();
      if (data.success) {
        toast.success("退款成功");
        setOrders((prev: any[]) =>
          prev.map((o) => o.id === orderId ? { ...o, status: "REFUNDED" } : o)
        );
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("退款失败");
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">订单管理</h1>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v || "all")}>
        <TabsList>
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="PENDING">待支付</TabsTrigger>
          <TabsTrigger value="PAID">已支付</TabsTrigger>
          <TabsTrigger value="COMPLETED">已完成</TabsTrigger>
          <TabsTrigger value="REFUNDED">已退款</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">暂无订单</div>
          ) : (
            <div className="space-y-3">
              {orders.map((order: any) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{order.orderNo}</span>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          用户: {order.user?.name || order.user?.phone} ·
                          陪玩: {order.companion?.nickname} ·
                          {order.durationHours}h ·
                          {order.paymentMethod === "WALLET" ? "钱包" : order.paymentMethod === "ALIPAY" ? "支付宝" : "微信"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">{formatPrice(order.amount)}</span>
                        {["PAID", "COMPLETED"].includes(order.status) && (
                          <Button variant="outline" size="sm" onClick={() => handleRefund(order.id)}>
                            <RefreshCw className="h-3 w-3 mr-1" />
                            退款
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}