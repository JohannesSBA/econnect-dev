import prisma from "@/app/lib/prisma";
import { pusherServer } from "@/app/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/app/lib/utils";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";

export async function POST(req: Request, res: Response) {
    const body = await req.json();
    const session = await getServerSession(options);

    // Vallidations for sending a message
    if (!session) return new Response("Unauthorized", { status: 401 });

    //Sender object
    const user = await getUserContent(session.user.id);

    // Check if the user is authorized to send a message
    if (user.role !== "EMPLOYER") {
        return new Response("User Type Unathorized", { status: 401 });
    }

    if (!body.tile || !body.description || !body.jobType || !body.location) {
        return new Response("Please Fill out all the fields", { status: 206 });
    }

    // Create a new joblisting
    const today = new Date();
    today.setMonth(today.getMonth() + 6);

    const newJob = await prisma.jobListing.create({
        data: {
            title: body.title,
            description: body.descrption,
            jobType: body.jobType,
            location: body.location,
            postedById: session.user.id,
            shortDescription: body.shortDescription,
            expireDate: new Date(today).toISOString(),
        },
    });

    return new Response(JSON.stringify(newJob), { status: 201 });
}
