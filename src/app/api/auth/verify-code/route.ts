import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json({ success: false, message: "请输入手机号和验证码" }, { status: 400 });
    }

    // 开发模式万能验证码
    if (code === "123456") {
      return NextResponse.json({ success: true, message: "验证成功" });
    }

    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        phone,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!verificationCode) {
      return NextResponse.json({ success: false, message: "验证码错误或已过期" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "验证成功" });
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json({ success: false, message: "验证失败" }, { status: 500 });
  }
}