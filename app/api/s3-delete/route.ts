import { DeleteObjectCommand, GetObjectCommand, S3 } from "@aws-sdk/client-s3";
import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

const client = new S3({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.S3ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3SECRET_ACCESS_KEY as string,
  },
});

export async function POST(req: Request) {
  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { ImageId } = body;

  const command = new DeleteObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: `newPostImage/${session?.user.id}/${ImageId}`,
  });

  try {
    const response = await client.send(command);
  } catch (err) {
    console.error(err);
  }

  return new Response("Deleted", { status: 200 });
}
