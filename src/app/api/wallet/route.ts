import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "请先登录" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user!.id },
      select: { walletBalance: true },
    });

    return NextResponse.json({
      success: true,
      data: { balance: user?.walletBalance || 0 },
    });
  } catch (error) {
    console.error("Get wallet error:", error);
    return NextResponse.json({ success: false, message: "获取失败" }, { status: 500 });
  }
}