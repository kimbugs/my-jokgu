import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  // 기존 User 타입 확장
  interface User {
    userId?: string;
    role?: UserRole; // role 추가
  }

  // AdapterUser 타입 확장
  interface AdapterUser {
    userId?: string;
    role?: UserRole; // AdapterUser에 role 추가
  }

  // Session 타입 확장
  interface Session {
    user: User & {
      userId?: string;
      role?: UserRole; // session에 user.role을 추가
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: UserRole; // JWT에 role 속성 추가
  }
}
