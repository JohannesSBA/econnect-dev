import prisma from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request, res: Response) {
  console.log(
    "🔍 Full Request Headers:",
    JSON.stringify(Object.fromEntries(req.headers), null, 2)
  );

  const body = await req.json();
  const token = req.headers.get("Authorization");

  if (!token) {
    console.error("🚨 No Authorization header received");
    return new Response("Unauthorized", { status: 401 });
  }

  console.log("🔍 Raw Authorization Header:", token);

  // Ensure token is a string
  if (typeof token !== "string") {
    console.error("🚨 Authorization header is not a string!", token);
    return new Response("Invalid Authorization header", { status: 400 });
  }

  const parts = token.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.error("🚨 Invalid Authorization format:", token);
    return new Response("Invalid Authorization header", { status: 400 });
  }

  const authToken = parts[1];
  console.log("🔍 Extracted Token:", authToken);

  try {
    const decoded = jwt.verify(
      authToken,
      process.env.NEXTAUTH_SECRET as string
    );
    const { userId } = decoded as { userId: string };

    console.log("✅ Token successfully verified. User ID:", userId);

    await prisma.user.update({
      where: { id: userId },
      data: { expoPushToken: body.expoPushToken },
    });

    return new Response("Token saved successfully", { status: 200 });
  } catch (error) {
    console.error("❌ JWT Verification Failed:", error);
    return new Response("Invalid token", { status: 401 });
  }
}
