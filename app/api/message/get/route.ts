import prisma from "@/app/lib/prisma";

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

  // Create a new message in the conversation
  const getMessage = await prisma.message.findMany({
    where: {
      OR: [
        {
          AND: [{ recipientId: body.chatId }, { senderId: body.chatPartner }],
        },
        {
          AND: [{ recipientId: body.chatPartner }, { senderId: body.chatId }],
        },
      ],
    },
    select: {
      id: true,
      createdAt: true,
      recipientId: true,
      senderId: true,
      text: true,
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      recipient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      readAt: true,
      readBy: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!getMessage) {
    return new Response("No messages found", { status: 404 });
  }

  if (body.from) {
    return new Response(JSON.stringify(getMessage), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:8081", // Include CORS if needed
      },
    });
  }

  return new Response(JSON.stringify(getMessage), { status: 200 });
}

//   await axios.post("/api/message/send", { text: input, chatId });
