import prisma from "@/app/lib/prisma";
import hashPassword from "@/app/helpers/hashPass";
import { Axios, AxiosError } from "axios";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export async function POST(req: Request, res: Response) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 403 });
  }
  const body = await req.json();

  // Check if the user with the given email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (existingUser) {
    return new Response("User Already exists", { status: 300 });
  }

  // If the user doesn't exist, proceed to create a new user
  const hashedPass = await hashPassword(body.password);
  let response = "Some data";

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODDEMAILER_EMAIL as string, // Your Gmail email address
      pass: process.env.NODEMAILER_PASS as string,
    },
  });

  const verificationToken = jwt.sign(
    {
      email: body.email,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
      phoneNumber: body.phoneNumber,
      role: body.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    }
  );

  console.log("Generated Token", verificationToken);

  const mailOptions = {
    from: "johannesseleshi@gmail.com",
    to: body.email,
    subject: "Email Verification",
    text: `Please verify your email by clicking on the following link: http://localhost:3000/api/user/verify-email?token=${verificationToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Generated Token", verificationToken);
      console.log("Email sent: " + info.response);
    }
  });

  return new Response(response, { status: 200 });
}
