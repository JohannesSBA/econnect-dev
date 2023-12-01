import prisma from "@/app/lib/prisma";
import hashPassword from "@/app/helpers/hashPass";
import { Axios, AxiosError } from "axios";

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  // Check if the user with the given email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (existingUser) {
    return new Response("User Already exists", { status: 300 });
  }

  // If the user doesn't exist, proceed to create a new user
  const hashedPass = await hashPassword(body.password);
  let response = "Some data";

  await prisma.user
    .create({
      data: {
        email: body.email,
        password: hashedPass,
        firstName: body.firstName,
        lastName: body.lastName,
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
