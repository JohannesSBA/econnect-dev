import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const offset = body.page * body.limit;
  const getJobs = await prisma.jobListing.findMany({
    skip: offset,
    take: body.limit,
    orderBy: { createdAt: "desc" },
  });

  return new Response(JSON.stringify(getJobs), { status: 201 });
}
