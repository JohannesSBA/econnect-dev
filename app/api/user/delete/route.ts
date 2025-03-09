import prisma from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin":
        "http://localhost:8081, exp://192.168.1.72:8081",
      "Access-Control-Allow-Methods": "DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function DELETE(req: Request) {
  // Get the Authorization header
  const authHeader = req.headers.get("Authorization");

  // Check if the header is present and correctly formatted
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET as string);

    // Assuming the decoded token contains a userId
    const { userId } = decoded as { userId: string };

    // Fetch the user from your database
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return new Response("Invalid token", { status: 401 });
  }
}
