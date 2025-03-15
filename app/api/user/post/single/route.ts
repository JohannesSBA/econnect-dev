import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request, res: Response) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 403 });
  }

  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const postId = body.postId;

  if (!postId) {
    return new Response("Post ID is required", { status: 400 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            location: true,
            title: true,
          },
        },
        likes: true,
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        categories: true,
        savedBy: true,
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    const stringifiedPost = JSON.stringify(post);
    return new Response(stringifiedPost, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return new Response("Something went wrong", { status: 500 });
  }
} 