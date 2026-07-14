"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentMethodSelect } from "@/components/payment/PaymentMethodSelect";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreateOrderFormProps {
  companionId: string;
  companionName: string;
  pricePerHour: number;
}

export function CreateOrderForm({ companionId, companionName, pricePerHour }: CreateOrderFormProps) {
  const router = useRouter();
  const [hours, setHours] = useState(1);
  const [serviceType, setServiceType] = useState("GAME");
  const [paymentMethod, setPaymentMethod] = useState("WALLET");
  const [loading, setLoading] = useState(false);

  const totalAmount = pricePerHour * hours;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companionId,
          serviceType,
          durationHours: hours,
          paymentMethod,
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("订单创建成功");
        router.push(`/order/${data.data.id}`);
      } else {
        toast.error(data.message || "下单失败");
      }
    } catch {
      toast.error("下单失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>服务类型</Label>
        <Select value={serviceType} onValueChange={(v) => setServiceType(v || "GAME")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GAME">游戏陪玩</SelectItem>
            <SelectItem value="CHAT">语音聊天</SelectItem>
            <SelectItem value="OTHER">其他服务</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>时长（小时）</Label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 5, 10].map((h) => (
            <Button
              key={h}
              type="button"
              variant={hours === h ? "default" : "outline"}
              size="sm"
              onClick={() => setHours(h)}
            >
              {h}h
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>支付方式</Label>
        <PaymentMethodSelect value={paymentMethod} onChange={setPaymentMethod} />
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>合计</span>
          <span className="text-primary">{formatPrice(totalAmount)}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {companionName} · {pricePerHour}元/小时 × {hours}小时
        </p>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? "下单中..." : "立即下单"}
      </Button>
    </form>
  );
}