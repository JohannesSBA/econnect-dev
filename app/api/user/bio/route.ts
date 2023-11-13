import prisma from "@/app/lib/prisma";
import { Axios, AxiosError } from "axios";
import { getServerSession } from "next-auth/next";
import { options } from "../../auth/[...nextauth]/options";

export async function PUT(req: Request, res: Response) {
  console.log("here");
  const body = await req.json();
  let response = "Some data";

  console.log(body);

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
