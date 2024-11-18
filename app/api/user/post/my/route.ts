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
  const offset = body.page * body.limit;

  if (body.from === "my") {
    try {
      const posts = await prisma.post.findMany({
        where: { authorId: body.userId },
        skip: offset,
        take: body.limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              email: true,
              location: true,
              lastName: true,
              title: true,
              likes: true,
            },
          },
          likes: true,
          comments: true,
          categories: true,
          reports: true,
          savedBy: true,
        }, // Include only the id and name of the author
      });
      const stringifiedPosts = JSON.stringify(posts);

      return new Response(stringifiedPosts, { status: 200 });
    } catch (error) {
      return new Response("Something went wrong", { status: 500 });
    }
  } else if (body.from === "default") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { friends: { select: { id: true } } },
      });
      const friendIds = user?.friends.map((friend) => friend.id); // Add null check for user
      const posts = await prisma.post.findMany({
        where: {
          authorId: { in: friendIds },
        },
        skip: offset,
        take: body.limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              email: true,
              location: true,
              lastName: true,
              title: true,
              likes: true,
            },
          },
          likes: true,
          comments: true,
          categories: true,
          reports: true,
          savedBy: true,
        }, // Include only the id and name of the author
      });

      const stringifiedPosts = JSON.stringify(posts);
      return new Response(stringifiedPosts, { status: 200 });
    } catch (error) {
      return new Response("Something went wrong", { status: 500 });
    }
  } else {
    try {
      const userId = body.userId;
      const posts = await prisma.post.findMany({
        where: { authorId: userId },
        skip: offset,
        take: body.limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              email: true,
              location: true,
              lastName: true,
              title: true,
              likes: true,
            },
          },
          likes: true,
          comments: true,
          categories: true,
          reports: true,
          savedBy: true,
        }, // Include only the id and name of the author
      });
      const stringifiedPosts = JSON.stringify(posts);

      return new Response(stringifiedPosts, { status: 200 });
    } catch (error) {
      return new Response("Something went wrong", { status: 500 });
    }
  }
}
