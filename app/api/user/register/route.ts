import prisma from "@/app/lib/prisma";
import hashPassword from "@/app/helpers/hashPass";
import { Axios, AxiosError } from "axios";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const hashedPass = await hashPassword(body.password);
  let response = "Some data";

  await prisma.user
    .create({
      data: {
        email: body.email,
        password: hashedPass,
        name: body.name,
        phoneNumber: body.phoneNumber,
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
