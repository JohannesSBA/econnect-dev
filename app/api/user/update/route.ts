import prisma from "@/app/lib/prisma";
import { Axios, AxiosError } from "axios";
import { getServerSession } from "next-auth/next";
import { options } from "../../auth/[...nextauth]/options";

export async function PUT(req: Request, res: Response) {
  const body = await req.json();
  let response = "Some data";

  const session = await getServerSession(options);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  let resq; // Declare resq variable

  try {
    resq = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        bio: body.bio,
        firstName: body.firstName,
        lastName: body.lastName,
        pronouns: body.pronouns,
        location: body.location,
        education: body.education,
        currentPosition: body.currentPosition,
        title: body.title,
      },
    });
  } catch (e) {
    if (e instanceof AxiosError) {
      response = e.message;
    } else {
      console.log(e);
    }
  }

  if (req.method !== "PUT") {
    return new Response("Method not allowed", { status: 403 });
  }
  return new Response(response, { status: 200 });
}
