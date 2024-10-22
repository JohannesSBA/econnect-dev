import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const offset = body.page * body.limit;
  const getJobs = await prisma.jobListing.findMany({
    skip: offset,
    take: body.limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      location: true,
      createdAt: true,
      updatedAt: true,
      applicants: true,
      description: true,
      jobType: true,
      postedById: true,
      shortDescription: true,
      expireCode: true,
      Expired: true,
      expireDate: true,
      postedBy: true,
      hired: true,
      HumanScreened: true,
      ComputerScreened: true,
    },
  });

  return new Response(JSON.stringify(getJobs), { status: 201 });
}
