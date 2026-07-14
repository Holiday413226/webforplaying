"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatPrice } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";

interface OrderCardProps {
  order: {
    id: string;
    orderNo: string;
    amount: number;
    status: string;
    serviceType: string;
    durationHours: number;
    paymentMethod: string | null;
    createdAt: string;
    companion: {
      nickname: string;
      avatarUrl: string;
    };
  };
}

export function OrderCard({ order }: OrderCardProps) {
  const serviceTypeLabel =
    order.serviceType === "GAME" ? "游戏陪玩" :
    order.serviceType === "CHAT" ? "语音聊天" : "其他服务";

  return (
    <Link href={`/order/${order.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <img
                src={order.companion.avatarUrl}
                alt={order.companion.nickname}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold">{order.companion.nickname}</h4>
                <p className="text-sm text-muted-foreground">{serviceTypeLabel} · {order.durationHours}小时</p>
              </div>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {order.durationHours}h
              </span>
            </div>
            <span className="font-bold text-primary">{formatPrice(order.amount)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}