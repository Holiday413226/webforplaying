import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "请先登录" }, { status: 401 });
    }

    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        companion: true,
        review: true,
        user: { select: { phone: true, name: true, avatar: true } },
      },
    });

    if (!order || order.userId !== session.user!.id) {
      return NextResponse.json({ success: false, message: "订单不存在" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json({ success: false, message: "获取订单失败" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "请先登录" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action } = body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order || order.userId !== session.user!.id) {
      return NextResponse.json({ success: false, message: "订单不存在" }, { status: 404 });
    }

    if (action === "cancel") {
      if (order.status !== "PENDING") {
        return NextResponse.json({ success: false, message: "只能取消待支付订单" }, { status: 400 });
      }

      const updated = await prisma.order.update({
        where: { id },
        data: { status: "CANCELLED", cancelledAt: new Date() },
      });

      return NextResponse.json({ success: true, data: updated });
    }

    if (action === "complete") {
      if (order.status !== "PAID") {
        return NextResponse.json({ success: false, message: "只能完成已支付订单" }, { status: 400 });
      }

      const updated = await prisma.$transaction(async (tx) => {
        const completed = await tx.order.update({
          where: { id },
          data: { status: "COMPLETED", completedAt: new Date() },
        });

        await tx.companion.update({
          where: { id: order.companionId },
          data: { orderCount: { increment: 1 } },
        });

        return completed;
      });

      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, message: "无效操作" }, { status: 400 });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json({ success: false, message: "操作失败" }, { status: 500 });
  }
}