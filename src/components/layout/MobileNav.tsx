"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Gamepad2, Search, ShoppingBag, Wallet, User, LogOut } from "lucide-react";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const { data: session } = useSession();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-72">
        <div className="flex flex-col gap-6 pt-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl" onClick={onClose}>
            <Gamepad2 className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              陪玩平台
            </span>
          </Link>

          <nav className="flex flex-col gap-2">
            <Link href="/companions" onClick={onClose}>
              <Button variant="ghost" className="w-full justify-start">
                <Search className="h-4 w-4 mr-2" />
                找陪玩
              </Button>
            </Link>

            {session ? (
              <>
                <Link href="/orders" onClick={onClose}>
                  <Button variant="ghost" className="w-full justify-start">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    我的订单
                  </Button>
                </Link>
                <Link href="/wallet" onClick={onClose}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Wallet className="h-4 w-4 mr-2" />
                    我的钱包
                  </Button>
                </Link>
                <Link href="/profile" onClick={onClose}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    个人中心
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500"
                  onClick={() => { signOut(); onClose(); }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  退出登录
                </Button>
              </>
            ) : (
              <Link href="/login" onClick={onClose}>
                <Button className="w-full">登录 / 注册</Button>
              </Link>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}