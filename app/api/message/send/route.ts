import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  console.log(body);

  // Create a new message in the conversation
  const newMessage = await prisma.message.create({
    data: {
      text: body.text,
      senderId: body.chatId,
      recipientId: body.chatPartner,
    },
  });

  return new Response(JSON.stringify(newMessage), { status: 201 });
}

//   await axios.post("/api/message/send", { text: input, chatId });
