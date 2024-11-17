import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  console.log("body", body);
  const session = await getServerSession(options);
  const timeStamp = Date();

  // Vallidations for sending a message
  if (!session) return new Response("Unauthorized", { status: 401 });

  const deletedAllMessages = await prisma.message.deleteMany({
    where: {
      OR: [
        {
          senderId: session.user.id,
          recipientId: body.friendId,
        },
        {
          senderId: body.friendId,
          recipientId: session.user.id,
        },
      ],
    },
  });

  return new Response(JSON.stringify(""), { status: 201 });
}
