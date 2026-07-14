import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "请先登录" }, { status: 401 });
    }

    const { orderId } = await req.json();
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order || order.userId !== session.user!.id) {
      return NextResponse.json({ success: false, message: "订单不存在" }, { status: 404 });
    }

    if (order.status !== "PENDING") {
      return NextResponse.json({ success: false, message: "订单状态不正确" }, { status: 400 });
    }

    // 开发模式：直接支付成功
    if (process.env.NODE_ENV === "development" || process.env.ALIPAY_APP_ID === "sandbox") {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID", paidAt: new Date() },
      });

      return NextResponse.json({ success: true, message: "支付成功" });
    }

    return NextResponse.json({ success: false, message: "请使用支付宝或微信支付" }, { status: 400 });
  } catch (error) {
    console.error("Pay order error:", error);
    return NextResponse.json({ success: false, message: "支付失败" }, { status: 500 });
  }
}