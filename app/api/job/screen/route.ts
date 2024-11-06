import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  const listing = await prisma.jobListing.findUnique({
    where: {
      id: body.jobId,
    },
    select: {
      description: true,
      applicant: true,
    },
  });

  console.log(listing);

  return new Response(JSON.stringify(""), { status: 200 });
}
