import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import axios from "axios";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const fileName = "dale.png"; // Change this to the actual file name in your public folder
  const filePath = path.join(process.cwd(), "public", fileName);

  const s3 = new S3({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });

  const key = `${fileName}--${Date.now()}`;

  const prismaKey = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${key}`;

  try {
    const fileContent = fs.readFileSync(filePath);
    const fileParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      ContentType: "image",
      Body: fileContent,
    };

    const command = new PutObjectCommand(fileParams);
    await s3.send(command);

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Error", { status: 400 });
  } finally {
  }
}
