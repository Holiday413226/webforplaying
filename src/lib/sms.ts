// SMS Service - 开发阶段打印验证码到控制台
export async function sendVerificationCode(phone: string, code: string): Promise<boolean> {
  if (process.env.NODE_ENV === "development" || !process.env.SMS_ACCESS_KEY_ID || process.env.SMS_ACCESS_KEY_ID === "dev") {
    console.log(`\n📱 ========================================`);
    console.log(`  短信验证码 (${phone}): ${code}`);
    console.log(`  验证码 6 位: ${code}`);
    console.log(`📱 ========================================\n`);
    return true;
  }

  // TODO: 接入阿里云短信服务
  // const client = new Dysmsapi({ ... });
  // await client.sendSms({ phoneNumbers: phone, signName: ..., templateCode: ..., templateParam: { code } });
  return true;
}