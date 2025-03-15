import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"; // Use NextResponse for handling responses in API routes
import jwt from "jsonwebtoken";
import prisma from "@/app/lib/prisma";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req: Request) {
  const body = await req.url;
  const email = body.split("email=")[1];
  const phoneNumber = body.split("phone=")[1];
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: email,
        },
        {
          phoneNumber: phoneNumber,
        },
      ],
    },
  });

  if (user) {
    return NextResponse.json(JSON.stringify("Email already exists"), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
          "http://localhost:8081, exp://192.168.1.72:8081", // Include CORS if needed
      },
    });
  }
  return NextResponse.json(JSON.stringify(""), { status: 200 });
}
