import prisma from "@/app/lib/prisma";
import { user } from "@nextui-org/react";
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
  const headers = req.headers;
  const token = headers.get("authorization");
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }
  const authToken = token.split(" ")[1];
  const decoded = jwt.verify(authToken, process.env.NEXTAUTH_SECRET as string);

  if (!decoded) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { userId } = decoded as { userId: string };

  if (userId !== body.chatId && userId !== body.chatPartner) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (userId === body.chatId) {
    const confirmedUserId = body.chatId;
  } else {
    const confirmedUserId = body.chatPartner;
  }
  // Create a new message in the conversation

  await prisma.message.updateMany({
    where: {
      recipientId: body.chatId,
      senderId: body.chatPartner,
      readAt: null,
      readBy: undefined,
    },
    data: {
      readAt: new Date(),
    },
  });

  return new Response("OK", { status: 200 });
}

//   await axios.post("/api/message/send", { text: input, chatId });
