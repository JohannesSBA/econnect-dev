import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { getUserContent } from "@/app/helpers/getUser";
import jwt from "jsonwebtoken";

export async function POST(req: Request, res: Response) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 403 });
  }

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
    const existingLike = await prisma.like.findFirst({
      where: {
        postId: body.postId,
        userId: user.id,
      },
    });

    if (!existingLike) {
      return new Response("Like not found", { status: 404 });
    }

    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });

    return new Response("Unlike", { status: 200 });
  }

  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await getUserContent(session.user.id);
  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const existingLike = await prisma.like.findFirst({
    where: {
      postId: body.postId,
      userId: user.id,
    },
  });

  if (!existingLike) {
    return new Response("Like not found", { status: 404 });
  }

  await prisma.like.delete({
    where: {
      id: existingLike.id,
    },
  });

  return new Response("Unliked", { status: 200 });
}
