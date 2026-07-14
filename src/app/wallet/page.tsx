"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { WalletBalance } from "@/components/payment/WalletBalance";
import { RechargeForm } from "@/components/payment/RechargeForm";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, RefreshCcw } from "lucide-react";

export default function WalletPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status !== "authenticated") return;

    Promise.all([
      fetch("/api/wallet").then((r) => r.json()),
      fetch("/api/wallet/transactions").then((r) => r.json()),
    ]).then(([walletData, txData]) => {
      if (walletData.success) setBalance(walletData.data.balance);
      if (txData.success) setTransactions(txData.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">我的钱包</h1>

      <WalletBalance balance={balance} />

      <Tabs defaultValue="recharge" className="mt-6">
        <TabsList className="w-full">
          <TabsTrigger value="recharge" className="flex-1">充值</TabsTrigger>
          <TabsTrigger value="transactions" className="flex-1">交易记录</TabsTrigger>
        </TabsList>

        <TabsContent value="recharge" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <RechargeForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {transactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">暂无交易记录</p>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx: any) => {
                    const isRecharge = tx.type === "RECHARGE";
                    const isRefund = tx.type === "REFUND";
                    const Icon = isRecharge ? ArrowDownLeft : isRefund ? RefreshCcw : ArrowUpRight;
                    const color = isRecharge ? "text-green-500" : isRefund ? "text-blue-500" : "text-red-500";

                    return (
                      <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full bg-muted ${color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {tx.type === "RECHARGE" ? "充值" : tx.type === "CONSUME" ? "消费" : "退款"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(tx.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${color}`}>
                            {isRecharge || isRefund ? "+" : "-"}{formatPrice(tx.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            余额: {formatPrice(tx.balanceAfter)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}