import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  // Create a new message in the conversation
  const getJobs = await prisma.jobListing.findMany();

  console.log(getJobs);

  return new Response(JSON.stringify(getJobs), { status: 201 });
}
