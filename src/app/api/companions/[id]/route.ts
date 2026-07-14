import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { toJsonArray } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const companion = await prisma.companion.findUnique({
      where: { id },
      include: {
        user: { select: { phone: true, name: true, avatar: true } },
        reviews: {
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!companion) {
      return NextResponse.json({ success: false, message: "陪玩不存在" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: companion });
  } catch (error) {
    console.error("Get companion error:", error);
    return NextResponse.json({ success: false, message: "获取失败" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "无权限" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const companion = await prisma.companion.update({
      where: { id },
      data: {
        nickname: body.nickname,
        gender: body.gender,
        age: body.age,
        city: body.city,
        avatarUrl: body.avatarUrl,
        photos: toJsonArray(body.photos || []),
        voiceIntroUrl: body.voiceIntroUrl || null,
        voiceDuration: body.voiceDuration || null,
        tags: toJsonArray(body.tags || []),
        pricePerHour: body.pricePerHour,
        bio: body.bio,
        status: body.status,
        isFeatured: body.isFeatured,
      },
    });

    return NextResponse.json({ success: true, data: companion });
  } catch (error) {
    console.error("Update companion error:", error);
    return NextResponse.json({ success: false, message: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "无权限" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.companion.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "删除成功" });
  } catch (error) {
    console.error("Delete companion error:", error);
    return NextResponse.json({ success: false, message: "删除失败" }, { status: 500 });
  }
}