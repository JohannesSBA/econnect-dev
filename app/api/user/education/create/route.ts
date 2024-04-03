import prisma from "@/app/lib/prisma";
import hashPassword from "@/app/helpers/hashPass";
import { Axios, AxiosError } from "axios";
import { Session, getServerSession } from "next-auth";
import { options } from "../../../auth/[...nextauth]/options";

export async function POST(req: Request, res: Response) {
  console.log("here");
  const body = await req.json();
  console.log(body);
  let response = "Some data";
  const session = (await getServerSession(options)) as Session;

  await prisma.education
    .create({
      data: {
        userId: session.user.id as string,
        school: body.school,
        degree: body.degree,
        GPA: body.GPA,
        major: body.major,
        startDate: body.startDate,
        endDate: body.endDate,
        description: body.description,
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
