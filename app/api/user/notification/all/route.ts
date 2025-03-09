import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"; // Use NextResponse for handling responses in API routes
import jwt from "jsonwebtoken";
import prisma from "@/app/lib/prisma";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin":
        "http://localhost:8081, exp://192.168.1.72:8081",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// Example backend API endpoint
export async function GET(req: Request) {
  const header = req.headers.get("Authorization");
  if (header) {
    const authToken = header.split(" ")[1];
    const decoded = jwt.verify(
      authToken,
      process.env.NEXTAUTH_SECRET as string
    );
    if (!decoded) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { userId } = decoded as { userId: string };
    const notification = await prisma.notification.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        content: true,
        read: true,
        createdAt: true,
      },
      take: 10,
    });
    return new NextResponse(JSON.stringify(notification), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
          "http://localhost:8081, exp://192.168.1.72:8081", // Include CORS if needed
      },
    });
  }
  const session = await getServerSession(options);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Query to get the count of unread messages for the current user
  const notification = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      userId: true,
      content: true,
      read: true,
      createdAt: true,
    },
    take: 10,
  });

  return NextResponse.json(JSON.stringify(notification), { status: 200 });
}
