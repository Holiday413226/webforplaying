import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateOrderNo } from "@/lib/utils";
import { createAlipayOrder } from "@/lib/alipay";
import { createWechatPayOrder } from "@/lib/wechat-pay";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "请先登录" }, { status: 401 });
    }

    const userId = (session.user as any).id as string;

    const { amount, paymentMethod } = await req.json();
    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, message: "金额无效" }, { status: 400 });
    }

    const orderNo = `RECHARGE_${generateOrderNo()}`;

    // 开发模式：直接充值成功
    if (process.env.NODE_ENV === "development" || process.env.ALIPAY_APP_ID === "sandbox") {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const newBalance = Number(user!.walletBalance) + amount;

      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { walletBalance: newBalance },
        }),
        prisma.transaction.create({
          data: {
            userId,
            type: "RECHARGE",
            amount,
            balanceBefore: user!.walletBalance,
            balanceAfter: newBalance,
            paymentMethod,
            externalTradeNo: orderNo,
            status: "SUCCESS",
          },
        }),
      ]);

      return NextResponse.json({ success: true, message: "充值成功", data: { balance: newBalance } });
    }

    // 生产模式
    let payInfo;
    if (paymentMethod === "ALIPAY") {
      payInfo = await createAlipayOrder({
        orderNo,
        amount,
        subject: "钱包充值",
        body: `充值 ${amount} 元`,
      });
    } else if (paymentMethod === "WECHAT") {
      payInfo = await createWechatPayOrder({
        orderNo,
        amount,
        description: "钱包充值",
      });
    }

    return NextResponse.json({ success: true, data: payInfo });
  } catch (error) {
    console.error("Recharge error:", error);
    return NextResponse.json({ success: false, message: "充值失败" }, { status: 500 });
  }
}