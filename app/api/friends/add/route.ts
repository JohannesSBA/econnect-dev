import prisma from "@/app/lib/prisma";
import { Session, getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();

    const idToAdd = await prisma.user.findUnique({
      where: {
        id: body.id,
      },
      select: {
        id: true,
        friends: true,
        friendOf: true,
      },
    });

    if (!idToAdd) {
      return new Response("This person does not exist.", { status: 400 });
    }

    const session = (await getServerSession(options)) as Session;

    if (!session) {
      return new Response("Unathorized", {
        status: 401,
      });
    }

    if (idToAdd.id === session.user.id) {
      return new Response("You cannot add yourself as a friend.", {
        status: 400,
      });
    }

    // check if user is already added
    // TODO: fix if friend is already added
    const friendsStringified = JSON.stringify(idToAdd.friends);
    const friendsOfStringified = JSON.stringify(idToAdd.friendOf);

    if (
      friendsStringified.includes(idToAdd.id) ||
      friendsOfStringified.includes(idToAdd.id)
    ) {
      return new Response("Already added this user", {
        status: 400,
      });
    }

    return new Response("OK.", { status: 200 });
  } catch (error) {
    return new Response("Invalid request.", { status: 400 });
  }

  // The following line is unreachable, you might want to remove it
  // return res.status(200).json({ message: response });
}
