import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"; // Use NextResponse for handling responses in API routes
import { options } from "../../auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";

// Example backend API endpoint
export async function GET(req: Request) {
  const session = await getServerSession(options);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Query to get the count of unread messages for the current user
  const unreadMessages = await prisma.message.count({
    where: {
      recipientId: session.user.id,
      readAt: null, // Assuming readAt is null for unread messages
    },
  });

  return NextResponse.json({ unreadCount: unreadMessages }, { status: 200 });
}
