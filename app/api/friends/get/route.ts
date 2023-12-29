import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";

export async function GET(req: Request, res: Response) {
  try {
    const session = await getServerSession(options);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const getFriends = await prisma.user.findMany({
      where: {
        email: session.user.email as string,
      },
      select: {
        friends: true,
      },
    });

    // Return the actual response with friends data
    return new Response(JSON.stringify(getFriends), { status: 200 });
  } catch (error) {
    console.error(error);

    // Return an error response
    return new Response("Error", { status: 500 });
  }
}
