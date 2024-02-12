import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(options);

  const getJobs = await prisma.jobListing.findMany({
    where: {
      postedById: session?.user.id as string,
    },
  });

  return new Response(JSON.stringify(getJobs), { status: 201 });
}
