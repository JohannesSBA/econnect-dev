import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";

export async function GET(req: Request, res: Response) {
  try {
    const session = await getServerSession(options);

    if (!session) return;

    const getFriends = await prisma.user.findMany({
      where: {
        email: session.user.email as string,
      },
      select: {
        friendOf: true,
        friends: true,
      },
    });

    return new Response(JSON.stringify(getFriends));
  } catch (error) {
    console.log(error);
  }
}
