import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const session = await getServerSession(options);
  console.log(body);
  try {
    // Update the user's friends list by adding the accepted friend
    if (body.friendId) {
      await prisma.user.update({
        where: { id: session?.user.id },
        data: {
          friends: {
            disconnect: { id: body.friendId },
          },
        },
      });
    } else {
      throw new Error("Friend ID is undefined");
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something Went wrong", { status: 500 });
  }
}
