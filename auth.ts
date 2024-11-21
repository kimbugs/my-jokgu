import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./lib/db";
import { saltAndHashPassword } from "./utils/helper";

prisma;
export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        id: {
          lable: "id",
          type: "id",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.id || !credentials.password) {
          return null;
        }

        const id = credentials.id as string;
        const password = saltAndHashPassword(credentials.password);

        let user: any = await prisma.user.findUnique({
          where: {
            userId: id,
          },
        });

        if (!user) {
          // user = await db.user.create({
          //   data: {
          //     userId: id,
          //     name: "test",
          //     password: password,
          //     role: "USER",
          //   },
          // });
          throw new Error("Incorrect user");
        } else {
          const isMatch = bcrypt.compareSync(
            credentials.password as string,
            user.password
          );
          if (!isMatch) {
            throw new Error("Incorrect password.");
          }
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.userId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.userId = token.userId;

      return session;
    },
  },
});
