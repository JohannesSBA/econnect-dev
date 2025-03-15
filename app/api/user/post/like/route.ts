import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  if (body.device === "mobile") {
    const token = req.headers.get("Authorization");
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }
    const authToken = token.split(" ")[1];
    const decoded = jwt.verify(
      authToken,
      process.env.NEXTAUTH_SECRET as string
    );
    const { userId } = decoded as { userId: string };
    const user = await getUserContent(userId);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    const likes = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        likes: {
          select: {
            postId: true,
          },
        },
      },
    });

    if (!user.id) {
      return new Response("User ID not found", { status: 400 });
    }

    if (likes?.likes.some((like) => like.postId === body.postId)) {
      return new Response("Already liked", { status: 400 });
    }
    await prisma.like.create({
      data: {
        postId: body.postId,
        userId: user.id,
      },
    });

    return new Response("Liked", { status: 200 });
  }
  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const user = await getUserContent(session.user.id);
  if (!user) {
    return new Response("User not found", { status: 404 });
  }
  const likes = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      likes: {
        select: {
          postId: true,
        },
      },
    },
  });

  if (!user.id) {
    return new Response("User ID not found", { status: 400 });
  }

  if (likes?.likes.some((like) => like.postId === body.postId)) {
    return new Response("Already liked", { status: 400 });
  }
  await prisma.like.create({
    data: {
      postId: body.postId,
      userId: user.id,
    },
  });

  return new Response("Liked", { status: 200 });
}
