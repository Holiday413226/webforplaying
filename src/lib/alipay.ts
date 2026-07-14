// 支付宝支付工具
// 开发阶段使用模拟模式

export async function createAlipayOrder(params: {
  orderNo: string;
  amount: number;
  subject: string;
  body?: string;
}): Promise<{ qrCode?: string; payUrl?: string }> {
  // 开发模式：返回模拟支付链接
  if (process.env.NODE_ENV === "development" || process.env.ALIPAY_APP_ID === "sandbox") {
    console.log(`\n💰 [支付宝] 创建支付订单:`);
    console.log(`  订单号: ${params.orderNo}`);
    console.log(`  金额: ¥${params.amount.toFixed(2)}`);
    console.log(`  商品: ${params.subject}`);
    console.log(`💰 [支付宝] 开发模式 - 自动支付成功\n`);
    return { payUrl: `/api/payment/alipay/callback?orderNo=${params.orderNo}&success=true` };
  }

  // TODO: 接入支付宝 SDK
  // const AlipaySdk = require("alipay-sdk").default;
  // const alipay = new AlipaySdk({ ... });
  // const result = await alipay.exec("alipay.trade.precreate", { ... });
  // return { qrCode: result.qr_code };
  throw new Error("Alipay SDK not configured");
}

export async function verifyAlipayCallback(params: Record<string, string>): Promise<boolean> {
  // 开发模式：始终返回 true
  if (process.env.NODE_ENV === "development" || process.env.ALIPAY_APP_ID === "sandbox") {
    return true;
  }

  // TODO: 验证支付宝回调签名
  return true;
}