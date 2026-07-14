"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Wallet } from "lucide-react";

interface WalletBalanceProps {
  balance: number;
}

export function WalletBalance({ balance }: WalletBalanceProps) {
  return (
    <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <Wallet className="h-5 w-5" />
          <span className="text-sm opacity-90">我的钱包</span>
        </div>
        <div className="text-3xl font-bold">{formatPrice(balance)}</div>
        <p className="text-sm opacity-80 mt-1">可用余额</p>
      </CardContent>
    </Card>
  );
}