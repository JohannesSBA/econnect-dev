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

  const resume = `https://econnectbucket.s3.amazonaws.com/resume/${session.user.id}`;
  const coverLetter = `https://econnectbucket.s3.amazonaws.com/coverLetter/${session.user.id}/${body.listingId}`;

  try {
    const applications = await prisma.jobListing.findUnique({
      where: {
        id: body.listingId,
      },
      select: {
        applicant: true,
      },
    });

    if (!applications) {
      return new Response("Listing not found", { status: 404 });
    }

    if (
      applications.applicant.find(
        (applicant) => applicant.userId === session.user.id
      )
    ) {
      return new Response("Already applied", { status: 401 });
    }

    const responses = JSON.stringify(body.responses);

    const application = await prisma.applicant.create({
      data: {
        userId: session.user.id,
        jobId: body.listingId,
        status: "pending", // or any default status
        resume: resume, // assuming resume is provided in the request body
        coverLetter: coverLetter, // assuming coverLetter is provided in the request body
        infromation: responses,
      },
    });

    return new Response(JSON.stringify(application), { status: 200 });
  } catch (error) {
    console.log(error);
  }
}
