import prisma from "@/app/lib/prisma";
import { pusherServer } from "@/app/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/app/lib/utils";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import jwt from "jsonwebtoken";

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

  if (!body.text) {
    return new Response("Message text is required", { status: 400 });
  }

  if (body.from !== "mobile") {
    const session = await getServerSession(options);
    if (!session) return new Response("Unauthorized", { status: 401 });

    if (!body.text) {
      return new Response("Message text is required", { status: 400 });
    }

    if (
      session.user.id !== body.chatId &&
      session.user.id !== body.chatPartner
    ) {
      return new Response("Unauthorized", { status: 401 });
    }
  } else {
    const token = req.headers.get("Authorization");
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }
    const authToken = token.split(" ")[1];
    const decoded = jwt.verify(
      authToken,
      process.env.NEXTAUTH_SECRET as string
    );
    if (!decoded) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { userId } = decoded as { userId: string };
    if (userId !== body.chatId && userId !== body.chatPartner) {
      return new Response("Unauthorized", { status: 401 });
    }
  }
  const timeStamp = Date();

  // Vallidations for sending a message

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
    deliveredAt: timeStamp,
  };

  //Pusher Events

  const chatRoom = body.chatRoom;

  await pusherServer.trigger(
    toPusherKey(`chat:${chatRoom}`),
    "incoming-message",
    messageData
  );

  await pusherServer.trigger(
    toPusherKey(`user:${messageData.recipientId}:chats`),
    "new_message",
    {
      ...messageData,
      senderImg: `https://econnectbucket.s3.amazonaws.com/image/${user.id}`,
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

  const messageNotification = `$asq!${messageData.senderId}message-${
    messageData.text
  }$user!${user.firstName + " " + user.lastName}`;
  await prisma.notification.create({
    data: {
      content: messageNotification,
      userId: messageData.recipientId,
    },
  });

  return new Response(JSON.stringify(newMessage), { status: 201 });
}
