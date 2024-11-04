import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const session = await getServerSession(options);

  console.log("this is", body);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const getListing = await prisma.jobListing.findUnique({
    where: {
      id: body.listing,
    },
    select: {
      applicant: true,
      ComputerScreened: true,
      hired: true,
      HumanScreened: true,
    },
  });

  //   console.log(getListing);
  const listing = await prisma.jobListing.update({
    where: {
      id: body.listing,
    },
    data: {
      applicant: {
        disconnect: { id: body.user },
      },
      hired: {
        connect: { id: body.user },
      },
    },
  });

  return new Response("Sucess", { status: 200 });
}
