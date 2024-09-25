import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import axios from "axios";

export async function POST(req: Request, res: Response) {
  const session = await getServerSession(options);
  const body = await req.formData();
  const image = body.get("newImage");
  const resume = body.get("newResume");
  const ImageId = body.get("Imageid");
  const entries = Array.from(body.entries());
  const newPostImages = entries.filter(([key]) =>
    key.startsWith("newPostImage")
  );

  if (!image && !resume && newPostImages.length === 0) {
    return new Response("File is required.", { status: 400 });
  }

  const s3 = new S3({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWSECRET_ACCESS_KEY as string,
    },
  });

  try {
    if (image) {
      const file = new Blob([image]);
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: `image/${session?.user.id}`,
        ContentType: "image/jpg",
        Body: buffer,
      };

      const command = new PutObjectCommand(fileParams);
      await s3.send(command);
    }

    if (resume) {
      const file = new Blob([resume as BlobPart], { type: "application/pdf" });
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: `resume/${session?.user.id}`,
        ContentType: "application/pdf",
        Body: buffer,
      };

      const command = new PutObjectCommand(fileParams);
      await s3.send(command);
    }

    if (newPostImages.length > 0) {
      for (let i = 0; i < newPostImages.length; i++) {
        const file = new Blob([newPostImages[i][1]]);
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: `newPostImage/${session?.user.id}/${ImageId}/${i}`,
          ContentType: "image/jpg",
          Body: buffer,
        };

        const command = new PutObjectCommand(fileParams);
        await s3.send(command);
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Error", { status: 400 });
  }
}
