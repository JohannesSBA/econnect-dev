import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  console.log("i made it here tho");
  try {
    const body = await req.json();
    const getFriends = await prisma.user.findMany({
      where: {
        id: body.session.user.id,
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
