import prisma from "@/app/lib/prisma";
import { pusherServer } from "@/app/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/app/lib/utils";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const session = await getServerSession(options);
  const timeStamp = Date();

  // Vallidations for sending a message
  if (!session) return new Response("Unauthorized", { status: 401 });

  if (!body.text) {
    return new Response("Message text is required", { status: 400 });
  }

  if (session.user.id !== body.chatId && session.user.id !== body.chatPartner) {
    return new Response("Unauthorized", { status: 401 });
  }

  //Sender object
  const user = await getUserContent(body.chatId);

  // Check if the user is authorized to send a message
  if (user.role === "employee") {
    const stringifiedFriends = JSON.stringify(user.friends);
    if (!stringifiedFriends.includes(body.chatPartner)) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  // Message objext
  const messageData = {
    text: body.text,
    senderId: body.chatId,
    recipientId: body.chatPartner,
    createdAt: timeStamp,
  };

  //Pusher Events

  const chatRoom = body.chatRoom;

  pusherServer.trigger(
    toPusherKey(`chat:${chatRoom}`),
    "incoming-message",
    messageData
  );

  pusherServer.trigger(
    toPusherKey(`user:${messageData.recipientId}:chats`),
    "new_message",
    {
      ...messageData,
      senderImg: `https://econnectbucket.s3.amazonaws.com/${user.id}`,
      senderName: user.fullName,
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
