import prisma from "@/app/lib/prisma";
import hashPassword from "@/app/helpers/hashPass";
import { Axios, AxiosError } from "axios";
import { Session, getServerSession } from "next-auth";
import { options } from "../../../auth/[...nextauth]/options";

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  await prisma.notification.update({
    where: {
      id: body.notificationId,
    },
    data: {
      read: true,
    },
  });

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 403 });
  }
  return new Response("Sucess", { status: 200 });
}
