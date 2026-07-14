import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "phone",
      credentials: {
        phone: { label: "手机号", type: "text" },
        code: { label: "验证码", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.code) return null;

        const { phone, code } = credentials as {
          phone: string;
          code: string;
        };

        // 开发模式：验证码 "123456" 始终有效
        if (code === "123456") {
          let user = await prisma.user.findUnique({
            where: { phone },
          });

          if (!user) {
            user = await prisma.user.create({
              data: { phone, name: `用户${phone.slice(-4)}` },
            });
          }

          return {
            id: user.id,
            phone: user.phone,
            name: user.name,
            role: user.role,
          };
        }

        // 生产模式：验证数据库中的验证码
        const verificationCode = await prisma.verificationCode.findFirst({
          where: {
            phone,
            code,
            used: false,
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: "desc" },
        });

        if (!verificationCode) return null;

        // 标记验证码已使用
        await prisma.verificationCode.update({
          where: { id: verificationCode.id },
          data: { used: true },
        });

        // 查找或创建用户
        let user = await prisma.user.findUnique({
          where: { phone },
        });

        if (!user) {
          user = await prisma.user.create({
            data: { phone, name: `用户${phone.slice(-4)}` },
          });
        }

        return {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = (user as any).phone;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).phone = token.phone;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});