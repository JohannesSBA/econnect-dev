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

  if (body.userId.id === session.user.id) {
    try {
      const userId = body.userId.id;
      const posts = await prisma.post.findMany({
        where: { authorId: userId },
      });
      const stringifiedPosts = JSON.stringify(posts);

      return new Response(stringifiedPosts, { status: 200 });
    } catch (error) {
      return new Response("Something went wrong", { status: 500 });
    }
  } else {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { friends: { select: { id: true } } },
      });
      const friendIds = user?.friends.map((friend) => friend.id); // Add null check for user
      const posts = await prisma.post.findMany({
        where: { authorId: { in: friendIds } },
      });
      const stringifiedPosts = JSON.stringify(posts);
      return new Response(stringifiedPosts, { status: 200 });
      console.log(posts);
    } catch (error) {
      return new Response("Something went wrong", { status: 500 });
    }
  }
  return new Response("Something went wrong", { status: 500 });
}
