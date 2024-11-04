import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const session = await getServerSession(options);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const listing = await prisma.jobListing.findUnique({
    where: {
      id: body.id,
    },
    select: {
      id: true,
      title: true,
      location: true,
      createdAt: true,
      updatedAt: true,
      applicant: true,
      description: true,
      jobType: true,
      postedById: true,
      shortDescription: true,
      expireCode: true,
      Expired: true,
      expireDate: true,
      postedBy: true,
    },
  });

  return new Response(JSON.stringify(listing), { status: 200 });
}
