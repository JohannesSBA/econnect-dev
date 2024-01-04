import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(options);
  if (!session) return;
  const numReq = await prisma.user.findMany({
    where: {
      id: session?.user.id,
    },
    select: {
      pendingFriendRequest: true,
    },
  });

  return new Response(JSON.stringify(numReq), { status: 200 });
}
