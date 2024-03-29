import prisma from "@/app/lib/prisma";
import { Axios, AxiosError } from "axios";
import { getServerSession } from "next-auth/next";
import { options } from "../../auth/[...nextauth]/options";

export async function PUT(req: Request, res: Response) {
  const body = await req.json();

  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    {
      const resq = await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          bio: body.bio,
          firstName: body.firstName,
          lastName: body.lastName,
          pronouns: body.pronouns,
          location: body.location,
          title: body.title,
        },
      });

      if (req.method !== "PUT") {
        return new Response("Method not allowed", { status: 403 });
      }

      return new Response("Some data", { status: 200 });
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return new Response("axios error", { status: 500 });
    }
    return new Response(error as string, { status: 500 });
  }
}
