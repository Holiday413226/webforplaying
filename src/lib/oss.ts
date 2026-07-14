// 阿里云 OSS 文件上传工具
// 开发阶段使用本地存储

import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch {
    // directory already exists
  }
}

export async function uploadFile(
  file: File,
  prefix: string
): Promise<string> {
  // 生产环境：上传到阿里云 OSS
  if (process.env.NODE_ENV === "production" && process.env.OSS_ACCESS_KEY_ID !== "dev") {
    return uploadToOSS(file, prefix);
  }

  // 开发环境：保存到本地 public/uploads
  await ensureUploadDir();

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "bin";
  const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  await writeFile(filepath, buffer);

  return `/uploads/${filename}`;
}

async function uploadToOSS(file: File, prefix: string): Promise<string> {
  // TODO: 接入阿里云 OSS SDK
  // const OSS = require("ali-oss");
  // const client = new OSS({
  //   region: process.env.OSS_REGION,
  //   accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  //   accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  //   bucket: process.env.OSS_BUCKET,
  // });
  // const buffer = Buffer.from(await file.arrayBuffer());
  // const ext = file.name.split(".").pop();
  // const filename = `${prefix}_${Date.now()}.${ext}`;
  // const result = await client.put(filename, buffer);
  // return result.url;
  throw new Error("OSS not configured");
}