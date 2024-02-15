import prisma from "@/app/lib/prisma";

export async function POST(res: Response, req: Request) {
  const listings = await prisma.jobListing.findMany();

  const today = new Date().toISOString().split("T")[0];

  for (let i = 0; i < listings.length; i++) {
    if (today > (listings[i].expireDate?.toISOString().split("T")[0] ?? "")) {
      await prisma.jobListing.update({
        where: {
          id: listings[i].id,
        },
        data: {
          Expired: true,
        },
      });
    }
  }
  return new Response("Job Successfully Archived", { status: 200 });
}
