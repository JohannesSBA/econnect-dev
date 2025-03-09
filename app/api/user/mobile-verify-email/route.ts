import prisma from "@/app/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import hashPassword from "@/app/helpers/hashPass";
import { parse } from "url";
import { redirect } from "next/navigation";

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin":
        "http://localhost:8081, exp://192.168.1.72:8081",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const { email, password, firstName, lastName, phoneNumber, role } = body;
  try {
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
