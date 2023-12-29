import prisma from "@/app/lib/prisma";

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
      createdAt: true,
      recipientId: true,
      senderId: true,
      text: true,
    },
  });

  return new Response(JSON.stringify(getMessage), { status: 201 });
}

//   await axios.post("/api/message/send", { text: input, chatId });
