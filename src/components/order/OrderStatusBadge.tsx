"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "待支付", variant: "secondary" },
  PAID: { label: "已支付", variant: "default" },
  IN_PROGRESS: { label: "进行中", variant: "default" },
  COMPLETED: { label: "已完成", variant: "outline" },
  CANCELLED: { label: "已取消", variant: "destructive" },
  REFUNDED: { label: "已退款", variant: "destructive" },
};

interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusMap[status] || { label: status, variant: "secondary" as const };

  return (
    <Badge
      variant={config.variant}
      className={cn(
        status === "PAID" && "bg-green-500",
        status === "IN_PROGRESS" && "bg-blue-500"
      )}
    >
      {config.label}
    </Badge>
  );
}