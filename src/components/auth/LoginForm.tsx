"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Gamepad2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  async function sendCode() {
    if (!phone || phone.length < 11) {
      toast.error("请输入正确的手机号");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("验证码已发送（开发模式：查看控制台）");
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) { clearInterval(timer); return 0; }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(data.message || "发送失败");
      }
    } catch {
      toast.error("发送失败，请重试");
    } finally {
      setSending(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || !code) {
      toast.error("请输入手机号和验证码");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        phone,
        code,
        redirect: false,
      });

      if (result?.error) {
        toast.error("验证码错误或已过期");
      } else {
        toast.success("登录成功！");
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("登录失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Gamepad2 className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl">欢迎回来</CardTitle>
        <CardDescription>使用手机号登录您的账户</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">手机号</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="请输入手机号"
              maxLength={11}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">验证码</Label>
            <div className="flex gap-2">
              <Input
                id="code"
                type="text"
                placeholder="请输入验证码"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              />
              <Button
                type="button"
                variant="outline"
                onClick={sendCode}
                disabled={sending || countdown > 0}
                className="shrink-0"
              >
                {countdown > 0 ? `${countdown}s` : sending ? "发送中..." : "获取验证码"}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "登录中..." : "登录"}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            开发模式：输入任意手机号，验证码使用 <code className="bg-muted px-1 rounded">123456</code>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}