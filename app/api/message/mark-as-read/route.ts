import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(options);
  const body = await req.json();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messageId } = body;

  if (!messageId) {
    return new Response("Message Id is required", { status: 400 });
  }

  try {
    // Assuming you have a "readBy" field in your Message model
    await prisma.message.update({
      where: { id: messageId },
      data: { readBy: { connect: { id: session.user.id } } },
    });

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error marking message as read:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
