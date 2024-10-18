import { getSession } from "next-auth/react";
import prisma from "@/app/lib/prisma"; // Assuming Prisma ORM is used
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: Request) {
  console.log("here");
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Get the session to identify the user making the request
    const session = await getServerSession(options);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const commentId = body.commentId;

    // Check if the comment exists
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        post: true, // Include the post to check if the user is the author of the post
      },
    });

    if (!comment) {
      return new Response("Comment not found", { status: 404 });
    }

    // Check if the user is either the comment author or the post author
    const isCommentAuthor = comment.authorId === userId;
    const isPostAuthor = comment.post.authorId === userId;

    if (!isCommentAuthor && !isPostAuthor) {
      return new Response("You are not allowed to delete this comment", {
        status: 403,
      });
    }

    // If checks pass, delete the comment
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return new Response("Comment deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
