import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 403 });
  }
  const body = await req.json();
  try {
    const userId = body.userId.id; // Assuming you have the user ID in the request body
    const friends = await prisma.user.findMany({
      where: {
        id: userId,
      },
      select: {
        friends: true,
      },
    });
    const mutuals = await prisma.user.findMany({
      where: {
        friends: userId,
      },
      select: {
        id: true,
      },
    });
    const friendIds = friends.map((friend) => friend.friends);
    const mutualIds = mutuals.map((mutual) => mutual.id);
    const postIds = [...friendIds, ...mutualIds];

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            authorId: {
              in: postIds,
            },
          },
          {
            authorId: userId,
          },
        ],
      },
      select: {
        author: true,
        authorId: true,
        categories: true,
        content: true,
        createdAt: true,
        published: true,
        title: true,
        updatedAt: true,
        id: true,
      },
    });

    const stringifiedPosts = JSON.stringify(posts);
    console.log("here", stringifiedPosts);
    return new Response(stringifiedPosts, { status: 200 });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}
