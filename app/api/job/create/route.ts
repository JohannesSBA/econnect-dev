import prisma from "@/app/lib/prisma";
import { pusherServer } from "@/app/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/app/lib/utils";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";

export async function POST(req: Request, res: Response) {
  console.log("here");
  const body = await req.json();
  const session = await getServerSession(options);
  const timeStamp = Date();

  // Vallidations for sending a message
  if (!session) return new Response("Unauthorized", { status: 401 });

  //Sender object
  const user = await getUserContent(session.user.id);

  // Check if the user is authorized to send a message
  if (user.role !== "EMPLOYER") {
    return new Response("User Type Unathorized", { status: 401 });
  }

  // Create a new joblisting
  const newJob = await prisma.jobListing.create({
    data: {
      title: body.title,
      description: body.descrption,
      jobType: body.jobType,
      location: body.location,
      postedById: session.user.id,
    },
  });

  return new Response(JSON.stringify(newJob), { status: 201 });
}
