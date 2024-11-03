import prisma from "@/app/lib/prisma";
import hashPassword from "@/app/helpers/hashPass";
import { Axios, AxiosError } from "axios";
import { Session, getServerSession } from "next-auth";
import { options } from "../../../auth/[...nextauth]/options";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  let response = "Some data";
  const session = (await getServerSession(options)) as Session;

  await prisma.post
    .create({
      data: {
        title: body.title,
        content: body.post,
        authorId: session.user.id as string,
        images: body.imageId,
      },
    })
    .catch((e: AxiosError) => {
      response = e.message;
    });

  const friends = await prisma.user.findMany({
    where: {
      id: session.user.id,
    },
    select: {
      friends: true,
    },
  });

  const postNotification = `$asq!${session.user.id}content-${body.post}$ast%%${body.title}`;

  for (const friend of friends[0].friends) {
    await prisma.notification.create({
      data: {
        content: postNotification,
        userId: friend.id as string,
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 403 });
  }
  return new Response(response, { status: 200 });
}
