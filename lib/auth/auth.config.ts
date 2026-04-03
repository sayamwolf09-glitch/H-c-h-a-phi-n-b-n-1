import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { checkRateLimit } from "@/lib/security/rate-limit";

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/dang-nhap"
  },
  session: {
    strategy: "jwt"
  },
  providers: [
    Credentials({
      name: "Đăng nhập",
      credentials: {
        username: { label: "Tên đăng nhập", type: "text" },
        password: { label: "Mật khẩu", type: "password" }
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const username = parsed.data.username.trim();

        const limit = checkRateLimit({
          key: `login:${username.toLowerCase()}`,
          windowMs: 60_000,
          max: 6
        });
        if (!limit.allowed) return null;

        const user = await prisma.user.findUnique({
          where: { username },
          include: {
            roles: {
              include: { role: true }
            }
          }
        });

        if (!user || !user.isActive || user.roles.length === 0) return null;
        const isValid = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.displayName,
          username: user.username,
          roles: user.roles.map((r) => r.role.code)
        };
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.roles = (user as { roles?: string[] }).roles ?? [];
        token.username = (user as { username?: string }).username;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.username = (token.username as string) ?? "";
        session.user.roles = (token.roles as string[]) ?? [];
      }
      return session;
    }
  }
};
