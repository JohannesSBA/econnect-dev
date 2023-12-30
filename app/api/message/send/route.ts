import prisma from "@/app/lib/prisma";
import { pusherServer } from "@/app/lib/pusher";
import { toPusherKey } from "@/app/lib/utils";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { Message, messageValidator } from "@/app/lib/validation";
import { BiFoodTag } from "react-icons/bi";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const session = await getServerSession(options);
  const timeStamp = Date();

  // Vallidations for sending a message
  if (!session) return new Response("Unauthorized", { status: 401 });

  if (session.user.id !== body.chatId && session.user.id !== body.chatPartner) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Message objext
  const messageData = {
    text: body.text,
    senderId: body.chatId,
    recipientId: body.chatPartner,
    createdAt: timeStamp,
  };

  //Pusher Events
  pusherServer.trigger(
    toPusherKey(`chat:${body.chatId}`),
    "incoming-message",
    messageData
  );

  pusherServer.trigger(
    toPusherKey(`chat:${body.chatPartner}`),
    "incoming-message",
    messageData
  );

  pusherServer.trigger(
    toPusherKey(`user:${body.chatid}:chats`),
    "new_message",
    {
      ...messageData,
    }
  );

  pusherServer.trigger(
    toPusherKey(`user:${body.chatPartner}:chats`),
    "new_message",
    {
      ...messageData,
    }
  );

  // Create a new message in the conversation
  const newMessage = await prisma.message.create({
    data: {
      text: messageData.text,
      senderId: messageData.senderId,
      recipientId: messageData.recipientId,
    },
  });

  return new Response(JSON.stringify(newMessage), { status: 201 });
}
