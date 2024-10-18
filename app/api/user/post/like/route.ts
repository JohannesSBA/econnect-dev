import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
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
  const user = await getUserContent(session.user.id);
  if (!user) {
    return new Response("User not found", { status: 404 });
  }
  const body = await req.json();
  const likes = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      likes: {
        select: {
          postId: true,
        },
      },
    },
  });

  if (!user.id) {
    return new Response("User ID not found", { status: 400 });
  }

  if (likes?.likes.some((like) => like.postId === body.postId)) {
    return new Response("Already liked", { status: 400 });
  }
  await prisma.like.create({
    data: {
      postId: body.postId,
      userId: user.id,
    },
  });

  return new Response("Liked", { status: 200 });
}
