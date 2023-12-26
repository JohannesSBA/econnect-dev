import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import axios from "axios";

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(options);
  const body = await req.formData();
  const file = body.get("newImage");

  if (!file) {
    return new Response("File is required.", { status: 400 });
  }

  const key = `${session?.user.id}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const s3 = new S3({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });

  const prismaKey = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${key}`;

  try {
    const fileParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      ContentType: "image/jpg",
      Body: buffer,
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
