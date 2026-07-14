// 微信支付工具
// 开发阶段使用模拟模式

export async function createWechatPayOrder(params: {
  orderNo: string;
  amount: number;
  description: string;
}): Promise<{ qrCode?: string; payUrl?: string }> {
  // 开发模式：返回模拟支付链接
  if (process.env.NODE_ENV === "development" || process.env.WECHAT_APP_ID === "dev") {
    console.log(`\n💚 [微信支付] 创建支付订单:`);
    console.log(`  订单号: ${params.orderNo}`);
    console.log(`  金额: ¥${params.amount.toFixed(2)}`);
    console.log(`  描述: ${params.description}`);
    console.log(`💚 [微信支付] 开发模式 - 自动支付成功\n`);
    return { payUrl: `/api/payment/wechat/callback?orderNo=${params.orderNo}&success=true` };
  }

  // TODO: 接入微信支付 SDK
  throw new Error("WeChat Pay SDK not configured");
}

export async function verifyWechatPayCallback(params: Record<string, string>): Promise<boolean> {
  // 开发模式：始终返回 true
  if (process.env.NODE_ENV === "development" || process.env.WECHAT_APP_ID === "dev") {
    return true;
  }

  // TODO: 验证微信支付回调签名
  return true;
}