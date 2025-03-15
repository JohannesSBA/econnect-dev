import prisma from "@/app/lib/prisma";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  console.log("Adding comment");
  try {
    const body = await req.json();
  if (body.from) {
    const header = req.headers.get("Authorization");
    if (!header) {
      return new Response("Unauthorized", { status: 401 });
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET as string);
    const { userId } = decoded as { userId: string };

    const { postId, comment } = body;
    if (!comment) {
      return new Response("Comment is required", { status: 400 });
    }
    await prisma.comment.create({
      data: {
        content: comment,
        postId: postId,
        authorId: userId,
      },
    });
    return new Response("Comment added", { status: 200 });
  }
  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  console.log(body)

  const postId = body.postId
  const comment = body.content

  if (!comment) {
    return new Response("Comment is required", { status: 400 });
  }

  await prisma.comment.create({
    data: {
      content: comment,
      postId: postId,
      authorId: session.user.id as string,
    },
  });
  } catch (error) {
    console.log(error);
    return new Response("Error adding comment", { status: 500 });
  }

  return new Response("Comment added", { status: 200 });
}
