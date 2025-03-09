import prisma from "@/app/lib/prisma";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin":
        "http://localhost:8081, exp://192.168.1.72:8081",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  if (body.from === "mobile") {
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
