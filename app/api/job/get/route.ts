import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  const getJobs = await prisma.jobListing.findMany();

  return new Response(JSON.stringify(getJobs), { status: 201 });
}
