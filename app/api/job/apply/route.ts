import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  if (!body) {
    return new Response("Missing id", { status: 400 });
  }

  try {
    const applications = await prisma.jobListing.findUnique({
      where: {
        id: body.listingId,
      },
      include: {
        applicants: true,
      },
    });

    if (!applications) {
      return new Response("Listing not found", { status: 404 });
    }

    if (
      applications.applicants.find(
        (applicant) => applicant.id === session.user.id
      )
    ) {
      return new Response("Already applied", { status: 400 });
    }

    const apply = await prisma.jobListing.update({
      where: {
        id: body.listingId,
      },
      data: {
        applicants: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
    return new Response(JSON.stringify(apply), { status: 200 });
  } catch (error) {
    console.log(error);
  }
}
