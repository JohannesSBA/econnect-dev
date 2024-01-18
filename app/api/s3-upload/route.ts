import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import axios from "axios";
import { preloadFont } from "next/dist/server/app-render/entry-base";

export async function POST(req: Request, res: Response) {
  console.log("bru");
  const session = await getServerSession(options);
  const body = await req.formData();
  const image = body.get("newImage");
  const resume = body.get("newResume");

  if (!image && !resume) {
    return new Response("File is required.", { status: 400 });
  }
  let file: Blob | null = null;
  if (image) {
    file = new Blob([image]);
  } else {
    file = new Blob([resume as BlobPart], { type: "application/pdf" });
  }

  let buffer: Buffer | null = null;
  if (file instanceof Blob) {
    buffer = Buffer.from(await file.arrayBuffer());
  }

  const s3 = new S3({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });

  try {
    const fileParams = image
      ? {
          Bucket: process.env.BUCKET_NAME,
          Key: `resume/${session?.user.id}`,
          ContentType: "image/jpg",
          Body: buffer || undefined,
        }
      : {
          Bucket: process.env.BUCKET_NAME,
          Key: `resume/${session?.user.id}`,
          ContentType: "application/pdf",
          Body: buffer || undefined,
        };

    const command = new PutObjectCommand(fileParams);
    console.log(command);
    await s3.send(command);

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Error", { status: 400 });
  } finally {
  }
}
