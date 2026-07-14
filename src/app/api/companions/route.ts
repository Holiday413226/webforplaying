import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { toJsonArray } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword") || "";
    const gender = searchParams.get("gender");
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const hasVoice = searchParams.get("hasVoice");
    const sortBy = searchParams.get("sortBy") || "order_count";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const status = searchParams.get("status");

    const where: any = {};

    if (keyword) {
      where.OR = [
        { nickname: { contains: keyword } },
        { tags: { contains: keyword } },
        { bio: { contains: keyword } },
      ];
    }
    if (gender) where.gender = gender;
    if (city) where.city = { contains: city };
    if (minPrice) where.pricePerHour = { ...where.pricePerHour, gte: parseFloat(minPrice) };
    if (maxPrice) where.pricePerHour = { ...where.pricePerHour, lte: parseFloat(maxPrice) };
    if (hasVoice === "true") where.voiceIntroUrl = { not: null };
    if (status) where.status = status;

    const orderBy: any = {};
    switch (sortBy) {
      case "price_asc": orderBy.pricePerHour = "asc"; break;
      case "price_desc": orderBy.pricePerHour = "desc"; break;
      case "rating": orderBy.rating = "desc"; break;
      default: orderBy.orderCount = "desc";
    }

    const [companions, total] = await Promise.all([
      prisma.companion.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.companion.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: companions,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Get companions error:", error);
    return NextResponse.json({ success: false, message: "获取陪玩列表失败" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "无权限" }, { status: 403 });
    }

    const userId = (session.user as any).id as string;

    const body = await req.json();
    const companion = await prisma.companion.create({
      data: {
        userId,
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
        bio: body.bio || null,
        status: body.status || "OFFLINE",
        isFeatured: body.isFeatured || false,
      },
    });

    return NextResponse.json({ success: true, data: companion });
  } catch (error) {
    console.error("Create companion error:", error);
    return NextResponse.json({ success: false, message: "创建失败" }, { status: 500 });
  }
}