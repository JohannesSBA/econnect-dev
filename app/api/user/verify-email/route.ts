import prisma from "@/app/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import hashPassword from "@/app/helpers/hashPass";
import { parse } from "url";
import { redirect } from "next/navigation";

export async function GET(req: Request, res: Response) {
  const { query } = parse(req.url || "", true);
  const { token } = query;

  if (!token) {
    return new Response("No token provided", { status: 400 });
  }

  try {
    const { email, password, firstName, lastName, phoneNumber, role } =
      jwt.verify(
        token as string,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

    // Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return new Response("User Already exists", { status: 300 });
    }

    // If the user doesn't exist, create a new user
    const hashedPass = await hashPassword(password);
    try {
      await prisma.user.create({
        data: {
          email,
          password: hashedPass,
          firstName,
          lastName,
          phoneNumber,
          role,
          emailVerified: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.log("error from primsa", error);
    }
    return new Response("User created successfully", {
      status: 302,
      headers: { Location: "/login?verified=true" },
    });
  } catch (error) {
    return new Response("Invalid token", { status: 400 });
  }
}
