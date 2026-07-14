"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, ShoppingBag, DollarSign, ChevronLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const adminLinks = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/companions", label: "陪玩管理", icon: Users },
  { href: "/admin/orders", label: "订单管理", icon: ShoppingBag },
  { href: "/admin/users", label: "用户管理", icon: MessageSquare },
  { href: "/admin/finance", label: "财务统计", icon: DollarSign },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-muted/30 min-h-screen">
      <div className="p-4 border-b">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
          <LayoutDashboard className="h-5 w-5" />
          <span>管理后台</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "font-semibold"
                )}
              >
                <Icon className="h-4 w-4 mr-2" />
                {link.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <ChevronLeft className="h-4 w-4 mr-2" />
            返回前台
          </Button>
        </Link>
      </div>
    </aside>
  );
}