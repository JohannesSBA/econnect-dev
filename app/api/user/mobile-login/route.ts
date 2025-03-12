import hashPassword from "@/app/helpers/hashPass";
import prisma from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  console.log("hi");
  const { email, password } = await req.json();

  console.log(email, password);

  const loweredEmail = email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: loweredEmail },
  });

  if (!user) {
    return new Response("Invalid Credentials", {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin":
          "http://localhost:8081, exp://192.168.1.72:8081",
      },
    });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return new Response("Invalid Credentials", {
      status: 405,
      headers: {
        "Access-Control-Allow-Origin":
          "http://localhost:8081, exp://192.168.1.72:8081",
      },
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.firstName,
      lastName: user.lastName,
    },
    process.env.NEXTAUTH_SECRET as string
  );

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {},
  });

  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin":
        "http://localhost:8081, exp://192.168.1.72:8081",
      "Content-Type": "application/json",
    },
  });
}
