import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadFile } from "@/lib/oss";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, message: "请先登录" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "请选择文件" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, message: "只支持图片文件" }, { status: 400 });
    }

    const url = await uploadFile(file, "photo");

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Upload photo error:", error);
    return NextResponse.json({ success: false, message: "上传失败" }, { status: 500 });
  }
}