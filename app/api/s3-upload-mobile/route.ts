import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import jwt from "jsonwebtoken";

/**
 * CORS preflight handler (if calling from a different origin).
 * Adjust Access-Control-Allow-Origin to your front-end address.
 */
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin":
        "http://localhost:8081, exp://192.168.1.72:8081",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

/**
 * Helper function that uploads a single Blob to your S3 bucket.
 * Declared at top-level (not inside any block) so it doesn’t trigger the ES5 strict-mode error.
 */
async function uploadToS3(
  s3: S3,
  blob: Blob,
  key: string,
  contentType: string = "application/octet-stream"
): Promise<void> {
  const buffer = Buffer.from(await blob.arrayBuffer());
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    Body: buffer,
  };
  const command = new PutObjectCommand(params);
  await s3.send(command);
}

export async function POST(req: NextRequest) {
  // Set up CORS response headers if needed
  const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:8081",
  };

  try {
    // 1) Verify Authorization header and JWT
    const header = req.headers.get("Authorization");
    if (!header || !header.startsWith("Bearer ")) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: corsHeaders,
      });
    }

    const token = header.split(" ")[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET as string);
    } catch (err) {
      return new NextResponse("Invalid token", {
        status: 401,
        headers: corsHeaders,
      });
    }

    const { userId } = decoded as { userId: string };
    if (!userId) {
      return new NextResponse("Missing userId in token", {
        status: 401,
        headers: corsHeaders,
      });
    }

    // 2) Parse the incoming FormData
    const formData = await req.formData();
    const image = formData.get("newImage");

    if (!image) {
      return new NextResponse("File is required.", {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Log the image object to debug

    const s3 = new S3({
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.S3ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3SECRET_ACCESS_KEY as string,
      },
    });

    // Ensure we have a valid Blob
    if (!(image instanceof Blob)) {
      return new NextResponse("Invalid file format", {
        status: 400,
        headers: corsHeaders,
      });
    }

    await uploadToS3(
      s3,
      image as Blob,
      `image/${userId}`,
      image.type || "image/jpeg"
    );

    return new NextResponse("OK", {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Error uploading file",
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
