"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { User, Phone, Shield, Wallet, ShoppingBag, Settings, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const role = (session?.user as any)?.role || "USER";
  const phone = (session?.user as any)?.phone || "";

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">个人中心</h1>

      {/* User Info Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl bg-gradient-to-br from-pink-400 to-purple-500 text-white">
                {session?.user?.name?.charAt(0) || <User className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{session?.user?.name || "用户"}</h2>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                <Phone className="h-3 w-3" />
                {phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-0.5">
                <Shield className="h-3 w-3" />
                {role === "ADMIN" ? "管理员" : role === "COMPANION" ? "陪玩者" : "普通用户"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <Link href="/wallet" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b">
            <div className="flex items-center gap-3">
              <Wallet className="h-5 w-5 text-green-500" />
              <span>我的钱包</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          <Link href="/orders" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-blue-500" />
              <span>我的订单</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </CardContent>
      </Card>

      {/* Admin Entry */}
      {role === "ADMIN" && (
        <Card className="mb-6">
          <CardContent className="p-0">
            <Link href="/admin" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-purple-500" />
                <span>管理后台</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Logout */}
      <Button
        variant="destructive"
        className="w-full"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut className="h-4 w-4 mr-2" />
        退出登录
      </Button>
    </div>
  );
}