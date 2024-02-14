import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  try {
    await prisma.jobListing.update({
      where: {
        id: body.id,
      },
      data: {
        Expired: false,
      },
    });
  } catch (error) {
    return new Response("Sorry, something went wrong.", { status: 500 });
  }

  return new Response("Job Successfully Archived", { status: 200 });
}
