"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status !== "authenticated") return;

    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrder(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, status, router]);

  async function handleAction(action: string) {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(action === "cancel" ? "订单已取消" : "订单已完成");
        setOrder(data.data);
      } else {
        toast.error(data.message || "操作失败");
      }
    } catch {
      toast.error("操作失败");
    }
  }

  async function handlePay() {
    try {
      const res = await fetch("/api/payment/pay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("支付成功！");
        setOrder((prev: any) => ({ ...prev, status: "PAID", paidAt: new Date().toISOString() }));
      } else {
        toast.error(data.message || "支付失败");
      }
    } catch {
      toast.error("支付失败");
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">订单不存在</p>
      </div>
    );
  }

  const serviceTypeLabel = order.serviceType === "GAME" ? "游戏陪玩" : order.serviceType === "CHAT" ? "语音聊天" : "其他服务";

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> 返回
      </button>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">订单详情</h1>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">订单编号</span>
              <span className="font-mono">{order.orderNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">陪玩</span>
              <span>{order.companion?.nickname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">服务类型</span>
              <span>{serviceTypeLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">时长</span>
              <span>{order.durationHours} 小时</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">支付方式</span>
              <span>{order.paymentMethod === "WALLET" ? "钱包余额" : order.paymentMethod === "ALIPAY" ? "支付宝" : "微信支付"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">创建时间</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            {order.paidAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">支付时间</span>
                <span>{new Date(order.paidAt).toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>订单金额</span>
              <span className="text-primary">{formatPrice(order.amount)}</span>
            </div>
          </div>

          {/* Actions */}
          {order.status === "PENDING" && (
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handlePay}>支付</Button>
              <Button variant="outline" onClick={() => handleAction("cancel")}>取消订单</Button>
            </div>
          )}
          {order.status === "PAID" && (
            <Button variant="outline" className="w-full" onClick={() => handleAction("complete")}>确认完成</Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}