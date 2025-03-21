import { getServerSession } from "next-auth";
import prisma from "@/app/lib/prisma";
import { socketIO, toPusherKey } from "@/app/lib/socket";
import { options } from "../../auth/[...nextauth]/options";
import { chatHrefConstructor } from "@/app/lib/utils";

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(options);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { messageIds } = body; // Accept a list of message IDs

  try {
    // Loop through each message and update it individually
    const updatePromises = messageIds.map(async (messageId: any) => {
      const updatedMessage = await prisma.message.update({
        where: { id: messageId.id }, // Only use the message ID in the where clause
        data: {
          readAt: new Date().toISOString(),
          readBy: {
            connect: { id: session.user.id },
          },
        },
      });

      const chatRoom = chatHrefConstructor(
        updatedMessage.recipientId,
        updatedMessage.senderId
      );
      
      // Use Socket.io instead of Pusher for real-time updates
      const io = socketIO.getIO();
      if (io) {
        // Broadcast a "message-read" event so both users see the update
        io.to(toPusherKey(`chat:${chatRoom}`)).emit('message-read', updatedMessage);
      } else {
        console.warn("Socket.io server not initialized. Make sure to initialize it before sending updates.");
      }
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    return new Response("Messages marked as read", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error marking messages as read", { status: 500 });
  }
}
