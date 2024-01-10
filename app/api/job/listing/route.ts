import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const session = await getServerSession(options);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const listing = await prisma.jobListing.findUnique({
    where: {
      id: body.id,
    },
  });

  return new Response(JSON.stringify(listing), { status: 200 });
}
