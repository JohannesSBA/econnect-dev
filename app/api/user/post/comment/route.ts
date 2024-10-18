import prisma from "@/app/lib/prisma";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { postId, comment } = await req.json();

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

  return new Response("Comment added", { status: 200 });
}
