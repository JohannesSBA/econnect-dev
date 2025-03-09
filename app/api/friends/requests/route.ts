import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin":
        "http://localhost:8081, exp://192.168.1.72:8081",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  if (body.from === "mobile") {
    const token = req.headers.get("Authorization");
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }
    const authToken = token.split(" ")[1];
    const decoded = jwt.verify(
      authToken,
      process.env.NEXTAUTH_SECRET as string
    );
    const { userId } = decoded as { userId: string };
    const numReq = await prisma.user.findMany({
      where: {
        id: userId,
      },
      select: {
        pendingFriendRequest: true,
      },
    });

    return new Response(JSON.stringify(numReq), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:8081", // Include CORS if needed
      },
    });
  }
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
