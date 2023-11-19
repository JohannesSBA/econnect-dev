import prisma from "@/app/lib/prisma";
import hashPassword from "@/app/helpers/hashPass";
import { Axios, AxiosError } from "axios";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const hashedPass = await hashPassword(body.password);
  let response = "Some data";
  const session = await getServerSession(options);

  console.log(body.title);
  console.log(body.post);

  await prisma.post
    .create({
      data: {
        title: body.title,
        content: body.post,
      },
    })
    .catch((e: AxiosError) => {
      response = e.message;
    });

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 403 });
  }
  return new Response(response, { status: 200 });
}
