import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const listing = body.listing;

  const applicants = await prisma.jobListing.findUnique({
    where: {
      id: listing as string,
    },
    select: {
      applicants: true,
    },
  });

  return new Response(JSON.stringify(applicants), { status: 200 });
}
