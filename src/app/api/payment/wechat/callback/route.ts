import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNo = searchParams.get("orderNo");
    const success = searchParams.get("success");

    if (success === "true" && orderNo) {
      console.log(`[微信支付回调] 支付成功: ${orderNo}`);
      return NextResponse.json({ code: "SUCCESS", message: "ok" });
    }

    return NextResponse.json({ code: "FAIL", message: "error" });
  } catch (error) {
    console.error("WeChat Pay callback error:", error);
    return NextResponse.json({ code: "FAIL", message: "error" }, { status: 500 });
  }
}