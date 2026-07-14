"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompanionGrid } from "@/components/companion/CompanionGrid";
import { Search, Mic, Shield, Zap, ArrowRight } from "lucide-react";

const POPULAR_TAGS = ["王者荣耀", "LOL", "原神", "声音好听", "技术陪", "娱乐陪", "FPS", "二次元"];

export default function HomePage() {
  const [featuredCompanions, setFeaturedCompanions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/companions?pageSize=5&sortBy=order_count")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFeaturedCompanions(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              找到你的专属陪玩
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            语音筛选、实名认证、安全支付 —— 高质量陪玩服务平台
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link href="/companions">
              <Button size="lg" className="text-lg px-8">
                <Search className="h-5 w-5 mr-2" />
                立即找陪玩
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_TAGS.map((tag) => (
              <Link key={tag} href={`/companions?keyword=${tag}`}>
                <Badge variant="secondary" className="px-4 py-2 text-sm hover:bg-primary/10 cursor-pointer transition-colors">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Superpowers Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">为什么选择我们</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mic className="h-8 w-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">声音优先发现</h3>
              <p className="text-muted-foreground">
                听声识人，语音自我介绍让你在选人前就能感受对方的真实声音和性格
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">三维验证身份</h3>
              <p className="text-muted-foreground">
                照片+声音+个人信息三重验证，平台自营审核，杜绝虚假
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">无缝混合支付</h3>
              <p className="text-muted-foreground">
                钱包余额+即时支付，支付宝+微信全覆盖，安全便捷
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companions */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">推荐陪玩</h2>
            <Link href="/companions">
              <Button variant="ghost">
                查看全部
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            </div>
          ) : (
            <CompanionGrid companions={featuredCompanions} />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-lg opacity-90 mb-8">加入我们，找到最适合你的陪玩伙伴</p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              立即注册
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}