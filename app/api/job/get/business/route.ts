import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(options);

  const getJobs = await prisma.jobListing.findMany({
    where: {
      postedById: session?.user.id as string,
    },
    select: {
      id: true,
      title: true,
      description: true,
      jobType: true,
      location: true,
      shortDescription: true,
      Expired: true,
      expireDate: true,
      applicant: true,
      postedById: true,
      ComputerScreened: true,
      hired: true,
      HumanScreened: true,
      postedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          location: true,
          title: true,
          likes: true,
        },
      },
    },
  });

  return new Response(JSON.stringify(getJobs), { status: 201 });
}
