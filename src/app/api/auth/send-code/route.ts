import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVerificationCode } from "@/lib/utils";
import { sendVerificationCode } from "@/lib/sms";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || phone.length < 11) {
      return NextResponse.json({ success: false, message: "请输入正确的手机号" }, { status: 400 });
    }

    const code = generateVerificationCode();

    // 保存验证码到数据库
    await prisma.verificationCode.create({
      data: {
        phone,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5分钟有效
      },
    });

    // 发送验证码
    await sendVerificationCode(phone, code);

    return NextResponse.json({ success: true, message: "验证码已发送" });
  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json({ success: false, message: "发送失败" }, { status: 500 });
  }
}