import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(options);
  const body = await req.json();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const getUser = await prisma.user.findUnique({
    where: {
      id: body.id,
    },
  });
  return new Response(JSON.stringify(getUser), { status: 200 });
}
