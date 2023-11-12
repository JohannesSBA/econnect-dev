import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Account, Profile } from "next-auth";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        userName: { label: "userName", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials:
          | Record<"email" | "userName" | "password", string>
          | undefined
      ): Promise<User | null> {
        const { email, password } = credentials ?? {};
        if (!email || !password) {
          throw new Error("Missing username or password");
        }
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        // if user doesn't exist or password doesn't match
        if (!user) {
          throw new Error("User does not exist");
        }
        if (!(await compare(password, user.password))) {
          throw new Error("Password is Incorrect");
        }

        const accessToken = jwt.sign(
          { userId: user.userId, email: user.email, name: user.name },
          process.env.NEXTAUTH_SECRET as string, // Use your secret key
          {
            expiresIn: "1d", // Set the expiration time as needed
          }
        );

        return {
          id: user.userId,
          email: user.email,
          name: user.name || "DefaultName",
        };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email;
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.image = token.picture;
      }

      return session;
    },
    // async jwt({ token, user }) {
    //   return token;
    // },

    async jwt({ token, user }) {
      const dbUserResult = await prisma.user.findUnique({
        where: {
          email: token.email as string,
        },
      });

      if (!dbUserResult) {
        if (user) {
          token.id = user!.id;
        }

        return token;
      }

      const dbUser = dbUserResult as unknown as User;

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl + "/dashboard";
    },
  },
};
