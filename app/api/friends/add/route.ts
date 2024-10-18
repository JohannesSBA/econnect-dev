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
        friendsOf: true,
        sentFriendRequest: true,
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

    const isAlreadyFriend = idToAdd.friends.some(
      (friend) => friend.id === session.user.id
    );
    if (isAlreadyFriend) {
      return new Response("Already added this user", {
        status: 400,
      });
    }

    const isPending = idToAdd.sentFriendRequest.some(
      (friend) => friend.id === session.user.id
    );

    if (isPending) {
      return new Response("You have already sent a request", {
        status: 208,
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: idToAdd.id,
      },
      data: {
        pendingFriendRequest: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return new Response("OK.", { status: 200 });
  } catch (error) {
    return new Response("Invalid request.", { status: 400 });
  }
}
