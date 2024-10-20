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
  const unreadNotification = await prisma.notification.count({
    where: {
      userId: session.user.id,
      read: false,
    },
  });

  return NextResponse.json(
    { unreadCount: unreadNotification },
    { status: 200 }
  );
}
