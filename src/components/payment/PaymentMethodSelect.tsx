"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Wallet, Smartphone, CreditCard } from "lucide-react";

const methods = [
  { id: "WALLET", label: "钱包余额", icon: Wallet, description: "使用账户余额支付" },
  { id: "ALIPAY", label: "支付宝", icon: Smartphone, description: "使用支付宝支付" },
  { id: "WECHAT", label: "微信支付", icon: CreditCard, description: "使用微信支付" },
];

interface PaymentMethodSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function PaymentMethodSelect({ value, onChange }: PaymentMethodSelectProps) {
  return (
    <div className="space-y-2">
      {methods.map((method) => {
        const Icon = method.icon;
        const isActive = value === method.id;

        return (
          <button
            key={method.id}
            type="button"
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
              isActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/30"
            )}
            onClick={() => onChange(method.id)}
          >
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full",
              isActive ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-medium">{method.label}</p>
              <p className="text-sm text-muted-foreground">{method.description}</p>
            </div>
            <div className="ml-auto">
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                isActive ? "border-primary" : "border-muted-foreground/30"
              )}>
                {isActive && <div className="w-3 h-3 rounded-full bg-primary" />}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}