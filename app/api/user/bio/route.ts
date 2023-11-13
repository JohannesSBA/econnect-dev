import prisma from "@/app/lib/prisma";
import { Axios, AxiosError } from "axios";

export async function PUT(req: Request, res: Response) {
  const body = await req.json();
  let response = "Some data";

  await prisma.user
    .update({
      where: {
        email: body.email,
      },
      data: {
        bio: body.bio,
      },
    })
    .catch((e: AxiosError) => {
      response = e.message;
    });

  if (req.method !== "PUT") {
    return new Response("Method not allowed", { status: 403 });
  }
  return new Response(response, { status: 200 });
}
