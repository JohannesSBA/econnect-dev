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
  const post = body.postId;

  if (!post) {
    return new Response("Post ID is required", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { posts: { select: { id: true } } },
  });

  let flag = false;
  user?.posts.forEach((p) => {
    if (p.id === post) {
      flag = true;
    }
  });

  if (flag === false) {
    return new Response("You can't delete someone else's post", {
      status: 403,
    });
  }

  try {
    await prisma.post.delete({
      where: { id: post },
    });

    return new Response("Post deleted", { status: 200 });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }
}
