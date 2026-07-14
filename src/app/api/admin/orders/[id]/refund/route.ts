import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "无权限" }, { status: 403 });
    }

    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      return NextResponse.json({ success: false, message: "订单不存在" }, { status: 404 });
    }

    if (!["PAID", "COMPLETED"].includes(order.status)) {
      return NextResponse.json({ success: false, message: "订单状态不可退款" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      // 退款到钱包
      if (order.paymentMethod === "WALLET") {
        const user = await tx.user.findUnique({ where: { id: order.userId } });
        const newBalance = user!.walletBalance + order.amount;

        await tx.user.update({
          where: { id: order.userId },
          data: { walletBalance: newBalance },
        });

        await tx.transaction.create({
          data: {
            userId: order.userId,
            type: "REFUND",
            amount: order.amount,
            balanceBefore: user!.walletBalance,
            balanceAfter: newBalance,
            paymentMethod: "WALLET",
            externalTradeNo: order.orderNo,
            status: "SUCCESS",
          },
        });
      }

      await tx.order.update({
        where: { id },
        data: { status: "REFUNDED" },
      });
    });

    return NextResponse.json({ success: true, message: "退款成功" });
  } catch (error) {
    console.error("Refund error:", error);
    return NextResponse.json({ success: false, message: "退款失败" }, { status: 500 });
  }
}