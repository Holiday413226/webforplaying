import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "无权限" }, { status: 403 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayOrders, todayRevenue, onlineCompanions, totalUsers, recentOrders] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.order.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: today }, status: { in: ["PAID", "COMPLETED"] } },
      }),
      prisma.companion.count({ where: { status: "ONLINE" } }),
      prisma.user.count(),
      prisma.order.findMany({
        include: {
          user: { select: { phone: true, name: true } },
          companion: { select: { nickname: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        todayOrders,
        todayRevenue: todayRevenue._sum.amount || 0,
        onlineCompanions,
        totalUsers,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ success: false, message: "获取失败" }, { status: 500 });
  }
}