import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateOrderNo } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "请先登录" }, { status: 401 });
    }

    const userId = (session.user as any).id as string;
    const { companionId, serviceType, durationHours, paymentMethod } = await req.json();

    const companion = await prisma.companion.findUnique({ where: { id: companionId } });
    if (!companion) {
      return NextResponse.json({ success: false, message: "陪玩不存在" }, { status: 404 });
    }

    const amount = companion.pricePerHour * (durationHours || 1);
    const orderNo = generateOrderNo();

    // 钱包支付：检查余额并扣款
    if (paymentMethod === "WALLET") {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || Number(user.walletBalance) < amount) {
        return NextResponse.json({ success: false, message: "余额不足，请充值" }, { status: 400 });
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      // 创建订单
      const newOrder = await tx.order.create({
        data: {
          orderNo,
          userId,
          companionId,
          serviceType,
          durationHours: durationHours || 1,
          amount,
          paymentMethod,
          status: paymentMethod === "WALLET" ? "PAID" : "PENDING",
          paidAt: paymentMethod === "WALLET" ? new Date() : null,
        },
      });

      // 钱包支付：扣款
      if (paymentMethod === "WALLET") {
        const user = await tx.user.findUnique({ where: { id: userId } });
        const newBalance = Number(user!.walletBalance) - amount;

        await tx.user.update({
          where: { id: userId },
          data: { walletBalance: newBalance },
        });

        await tx.transaction.create({
          data: {
            userId,
            type: "CONSUME",
            amount,
            balanceBefore: user!.walletBalance,
            balanceAfter: newBalance,
            paymentMethod: "WALLET",
            externalTradeNo: orderNo,
            status: "SUCCESS",
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ success: false, message: "下单失败" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "请先登录" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const where: any = { userId: session.user!.id };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          companion: { select: { nickname: true, avatarUrl: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json({ success: false, message: "获取订单失败" }, { status: 500 });
  }
}