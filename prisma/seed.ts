import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 创建管理员
  const admin = await prisma.user.upsert({
    where: { phone: "13800000001" },
    update: { role: "ADMIN" },
    create: {
      phone: "13800000001",
      name: "管理员",
      role: "ADMIN",
      walletBalance: 0,
    },
  });
  console.log(`Admin created: ${admin.phone}`);

  // 创建测试用户
  const user = await prisma.user.upsert({
    where: { phone: "13800000002" },
    update: {},
    create: {
      phone: "13800000002",
      name: "测试用户",
      role: "USER",
      walletBalance: 500,
    },
  });
  console.log(`User created: ${user.phone}`);

  // 创建陪玩者
  const companions = [
    {
      nickname: "小鹿酱",
      gender: "FEMALE",
      age: 22,
      city: "上海",
      avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alice",
      photos: JSON.stringify([
        "https://api.dicebear.com/9.x/avataaars/svg?seed=Alice",
        "https://api.dicebear.com/9.x/avataaars/svg?seed=Alice2",
      ]),
      voiceIntroUrl: null,
      voiceDuration: null,
      tags: JSON.stringify(["王者荣耀", "声音好听", "娱乐陪", "LOL"]),
      pricePerHour: 50,
      bio: "5年王者荣耀玩家，最高段位王者50星。擅长辅助和中单，温柔耐心，陪你快乐上分~",
      status: "ONLINE",
      rating: 4.9,
      orderCount: 128,
      isFeatured: true,
    },
    {
      nickname: "疾风剑豪",
      gender: "MALE",
      age: 25,
      city: "北京",
      avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Bob",
      photos: JSON.stringify([
        "https://api.dicebear.com/9.x/avataaars/svg?seed=Bob",
        "https://api.dicebear.com/9.x/avataaars/svg?seed=Bob2",
      ]),
      voiceIntroUrl: null,
      voiceDuration: null,
      tags: JSON.stringify(["LOL", "技术陪", "FPS", "PUBG"]),
      pricePerHour: 80,
      bio: "LOL一区大师，PUBG亚服前500。实力派技术陪，带你起飞！",
      status: "ONLINE",
      rating: 4.8,
      orderCount: 256,
      isFeatured: true,
    },
    {
      nickname: "甜心喵喵",
      gender: "FEMALE",
      age: 20,
      city: "广州",
      avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Cathy",
      photos: JSON.stringify([
        "https://api.dicebear.com/9.x/avataaars/svg?seed=Cathy",
      ]),
      voiceIntroUrl: null,
      voiceDuration: null,
      tags: JSON.stringify(["原神", "二次元", "声音好听", "娱乐陪"]),
      pricePerHour: 40,
      bio: "原神开服玩家，全图鉴收集。喜欢二次元文化，一起探索提瓦特大陆吧！",
      status: "ONLINE",
      rating: 4.7,
      orderCount: 89,
      isFeatured: true,
    },
    {
      nickname: "电竞老司机",
      gender: "MALE",
      age: 28,
      city: "深圳",
      avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Dave",
      photos: JSON.stringify([
        "https://api.dicebear.com/9.x/avataaars/svg?seed=Dave",
      ]),
      voiceIntroUrl: null,
      voiceDuration: null,
      tags: JSON.stringify(["LOL", "王者荣耀", "技术陪", "DOTA2"]),
      pricePerHour: 100,
      bio: "多款MOBA游戏高分段玩家，LOL和DOTA2双修。专业教练级陪玩，助你提升技术！",
      status: "ONLINE",
      rating: 4.9,
      orderCount: 512,
      isFeatured: true,
    },
    {
      nickname: "元气少女",
      gender: "FEMALE",
      age: 21,
      city: "杭州",
      avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Eva",
      photos: JSON.stringify([
        "https://api.dicebear.com/9.x/avataaars/svg?seed=Eva",
        "https://api.dicebear.com/9.x/avataaars/svg?seed=Eva2",
        "https://api.dicebear.com/9.x/avataaars/svg?seed=Eva3",
      ]),
      voiceIntroUrl: null,
      voiceDuration: null,
      tags: JSON.stringify(["娱乐陪", "聊天", "声音好听", "王者荣耀"]),
      pricePerHour: 35,
      bio: "活泼开朗的元气少女，唱歌好听，聊天逗趣，让你的游戏时光不再孤单！",
      status: "OFFLINE",
      rating: 4.6,
      orderCount: 67,
      isFeatured: false,
    },
  ];

  for (const comp of companions) {
    const user = await prisma.user.create({
      data: {
        phone: `139${Math.random().toString().slice(2, 10)}`,
        name: comp.nickname,
        role: "COMPANION",
        walletBalance: 0,
      },
    });

    await prisma.companion.create({
      data: {
        ...comp,
        userId: user.id,
      },
    });
    console.log(`Companion created: ${comp.nickname}`);
  }

  console.log("\n✅ Seed complete!");
  console.log("\nLogin credentials:");
  console.log("  Admin: 13800000001 / code: 123456");
  console.log("  User:  13800000002 / code: 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });