import prisma from "@/app/lib/prisma";
import hashPassword from "@/app/helpers/hashPass";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { Options } from "nodemailer/lib/mailer";

async function wrappedSendMail(mailOptions: Options) {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Use 587 if TLS is required
      secure: true,
      auth: {
        user: process.env.NODDEMAILER_EMAIL as string, // Your Gmail email address
        pass: process.env.NODEMAILER_PASS as string,
      },
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        reject(error);
      } else {
        console.log("Email sent: ", info.response);
        resolve(true);
      }
    });
  });
}

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

  const existingNumber = await prisma.user.findUnique({
    where: {
      phoneNumber: body.phoneNumber,
    },
  });

  if (existingUser) {
    return new Response("User Already exists", { status: 300 });
  }

  if (existingNumber) {
    return new Response("Phone Number Already exists", { status: 300 });
  }

  // If the user doesn't exist, proceed to create a new user
  const hashedPass = await hashPassword(body.password);
  let response = "Some data";

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

  const mailOptions = {
    from: process.env.NODDEMAILER_EMAIL as string,
    to: body.email,
    subject: "Email Verification",
    text: `Please verify your email by clicking on the following link: https://main.d1lrbytgl21u6i.amplifyapp.com/api/user/verify-email?token=${verificationToken}`,
    html: `<section className="max-w-2xl px-6 py-8 mx-auto bg-white dark:bg-gray-900">
      <header>
          <a href="#">
              <img className="w-auto h-7 sm:h-8" src="" alt="">
          </a>
      </header>

      <main className="mt-8">
          <h2 className="text-gray-700 dark:text-gray-200">Hi ${body.firstName},</h2>

          <p className="mt-4 leading-loose text-gray-600 dark:text-gray-300">
              This code will only be valid for the next 5 minutes. If the code does not work, you can use this login verification link:
          </p>

          <a href="https://main.d1lrbytgl21u6i.amplifyapp.com/api/user/verify-email?token=${verificationToken}" className="px-6 py-2 mt-6 text-sm font-medium tracking-wider text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
              Verify email
          </a>

          <p className="mt-8 text-gray-600 dark:text-gray-300">
              Thanks, <br>
              Econnect Team
          </p>
      </main>
  </section>`,
  };

  try {
    await wrappedSendMail(mailOptions);
    return new Response(response, { status: 200 });
  } catch (error) {
    return new Response("Failed to send email", { status: 500 });
  }
}
