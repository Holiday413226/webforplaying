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

    if (!file.type.startsWith("audio/")) {
      return NextResponse.json({ success: false, message: "只支持音频文件" }, { status: 400 });
    }

    const url = await uploadFile(file, "voice");

    // 获取音频时长（简化处理）
    let duration = 0;
    try {
      // 尝试从文件大小估算时长（粗略估算：1MB ≈ 60秒）
      duration = Math.round(file.size / 1024 / 1024 * 60);
    } catch {}

    return NextResponse.json({ success: true, url, duration });
  } catch (error) {
    console.error("Upload voice error:", error);
    return NextResponse.json({ success: false, message: "上传失败" }, { status: 500 });
  }
}