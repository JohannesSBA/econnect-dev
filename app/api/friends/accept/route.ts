import prisma from "@/app/lib/prisma";
import { options } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const session = await getServerSession(options);
  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    // Update the user's friends list by adding the accepted friend
    await prisma.user.update({
      where: { email: body.email },
      data: {
        friends: {
          connect: { id: body.id },
        },
        pendingFriendRequest: {
          disconnect: { id: body.id },
        },
      },
    });

    await prisma.user.update({
      where: { id: body.id },
      data: {
        friends: {
          connect: { id: session.user.id },
        },
        sentFriendRequest: {
          disconnect: { id: session.user.id },
        },
      },
    });

    return new Response("OK", { status: 200 });
  } catch (error) {
    return new Response("Something Went wrong", { status: 500 });
  }
}
