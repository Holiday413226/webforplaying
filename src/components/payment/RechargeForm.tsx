"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentMethodSelect } from "./PaymentMethodSelect";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RechargeForm() {
  const router = useRouter();
  const [amount, setAmount] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState("ALIPAY");
  const [loading, setLoading] = useState(false);

  const presetAmounts = [50, 100, 200, 500, 1000];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (amount <= 0) {
      toast.error("请输入充值金额");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/payment/recharge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, paymentMethod }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("充值成功！");
        router.refresh();
      } else {
        toast.error(data.message || "充值失败");
      }
    } catch {
      toast.error("充值失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>充值金额</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {presetAmounts.map((a) => (
            <Button
              key={a}
              type="button"
              variant={amount === a ? "default" : "outline"}
              size="sm"
              onClick={() => setAmount(a)}
            >
              ¥{a}
            </Button>
          ))}
        </div>
        <Input
          type="number"
          placeholder="自定义金额"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label>支付方式</Label>
        <PaymentMethodSelect value={paymentMethod} onChange={setPaymentMethod} />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "充值中..." : `确认充值 ¥${amount}`}
      </Button>
    </form>
  );
}