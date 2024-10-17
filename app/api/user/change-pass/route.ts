import prisma from "@/app/lib/prisma";
import hashPassword from "@/app/helpers/hashPass";
import { Axios, AxiosError } from "axios";
import { Session, getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  let response = "Some data";
  console.log(body);
  const session = (await getServerSession(options)) as Session;
  const { OldPassword, newPassword } = body;
  const checkUserPass = await prisma.user.findMany({
    where: {
      email: session.user.email as string,
    },
    select: {
      password: true,
    },
  });

  const serverPass = checkUserPass[0].password;
  const isMatch = (await hashPassword(OldPassword)) === serverPass;
  console.log(serverPass, await hashPassword(OldPassword), isMatch);

  if (isMatch === false) {
    return new Response("Incorrect password", { status: 400 });
  }

  if (isMatch) {
    const hashedPass = await hashPassword(newPassword);
    try {
      await prisma.user.update({
        where: { email: session.user.email as string },
        data: {
          password: hashedPass,
        },
      });
    } catch (error) {
      console.log("error from primsa", error);
    }
    response = "Password changed successfully";
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 403 });
  }
  return new Response(response, { status: 200 });
}
