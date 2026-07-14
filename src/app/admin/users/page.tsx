"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatPrice } from "@/lib/utils";
import { User, Shield, Crown } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 通过 fetch 获取用户列表
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((data) => {
        // 从 dashboard 获取 totalUsers 用于展示
        // 实际用户列表需要通过单独 API 获取
        // 这里简化处理
      })
      .catch(console.error);

    // 模拟用户数据（实际应通过 API 获取）
    setUsers([]);
    setLoading(false);
  }, []);

  const roleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-purple-500"><Crown className="h-3 w-3 mr-1" />管理员</Badge>;
      case "COMPANION":
        return <Badge className="bg-blue-500"><Shield className="h-3 w-3 mr-1" />陪玩者</Badge>;
      default:
        return <Badge variant="secondary"><User className="h-3 w-3 mr-1" />用户</Badge>;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">用户管理</h1>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </div>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">用户管理功能将在后续版本中完善</p>
            <p className="text-sm text-muted-foreground mt-1">包括用户列表、封禁、角色管理等功能</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {users.map((u: any) => (
            <Card key={u.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <Avatar>
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{u.name || "未命名"}</p>
                  <p className="text-sm text-muted-foreground">{u.phone}</p>
                </div>
                {roleBadge(u.role)}
                <span className="font-semibold">{formatPrice(u.walletBalance)}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}