import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.formData();
  const image = body.get("newImage");
  const resume = body.get("newResume");
  const coverLetter = body.get("newCoverLetter");
  const ImageId = body.get("Imageid");
  const entries = Array.from(body.entries());
  const newPostImages = entries.filter(([key]) =>
    key.startsWith("newPostImage")
  );

  if (!image && !resume && !coverLetter && newPostImages.length === 0) {
    return new NextResponse("File is required.", { status: 400 });
  }

  const s3 = new S3({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.S3ACCESS_KEY_ID as string,
      secretAccessKey: process.env.S3SECRET_ACCESS_KEY as string,
    },
  });

  try {
    if (image) {
      const buffer = Buffer.from(await (image as Blob).arrayBuffer());
      const fileParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: `image/${session.user.id}`,
        ContentType: "image/jpg",
        Body: buffer,
      };

      const command = new PutObjectCommand(fileParams);
      await s3.send(command);
    }

    if (resume) {
      const buffer = Buffer.from(await (resume as Blob).arrayBuffer());
      const fileParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: `resume/${session.user.id}`,
        ContentType: "application/pdf",
        Body: buffer,
      };

      const command = new PutObjectCommand(fileParams);
      await s3.send(command);
    }

    if (coverLetter) {
      const buffer = Buffer.from(await (coverLetter as Blob).arrayBuffer());
      const fileParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: `coverLetter/${session.user.id}/${ImageId}`,
        ContentType: "application/pdf",
        Body: buffer,
      };

      const command = new PutObjectCommand(fileParams);
      await s3.send(command);
    }

    if (newPostImages.length > 0) {
      for (let i = 0; i < newPostImages.length; i++) {
        const buffer = Buffer.from(
          await (newPostImages[i][1] as Blob).arrayBuffer()
        );
        const fileParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: `newPostImage/${session.user.id}/${ImageId}/${i}`,
          ContentType: "image/jpg",
          Body: buffer,
        };

        const command = new PutObjectCommand(fileParams);
        await s3.send(command);
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
