import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"; // Use NextResponse for handling responses in API routes

import prisma from "@/app/lib/prisma";
import { options } from "@/app/api/auth/[...nextauth]/options";

// Example backend API endpoint
export async function GET(req: Request) {
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

  console.log(notification);

  return NextResponse.json(JSON.stringify(notification), { status: 200 });
}
