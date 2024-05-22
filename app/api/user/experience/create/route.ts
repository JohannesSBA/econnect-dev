import prisma from "@/app/lib/prisma";
import { Axios, AxiosError } from "axios";
import { Session, getServerSession } from "next-auth";
import { options } from "../../../auth/[...nextauth]/options";

export async function POST(req: Request, res: Response) {
    const body = await req.json();
    console.log(body);
    let response = "Some data";
    const session = (await getServerSession(options)) as Session;

    await prisma.experience
        .create({
            data: {
                userId: session.user.id as string,
                title: body.title,
                EmploymentType: body.EmploymentType,
                CompanyName: body.CompanyName,
                LocationName: body.LocationName,
                LocationType: body.LocationType,
                currently: body.currently,
                startDate: body.startDate,
                endDate: body.endDate,
                Description: body.Description,
            },
        })
        .catch(() => {
            return new Response(response, { status: 200 });
        });

    if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 403 });
    }
    return new Response(response, { status: 200 });
}
