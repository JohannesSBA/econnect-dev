import prisma from "@/app/lib/prisma";
import { Axios, AxiosError } from "axios";
import { Session, getServerSession } from "next-auth";
import { options } from "../../../auth/[...nextauth]/options";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  let response = "Some data";
  console.log(body);
  const session = (await getServerSession(options)) as Session;

  await prisma.experience
    .create({
      data: {
        userId: session.user.id as string,
        title: body.title,
        employmentType: body.EmploymentType,
        companyName: body.CompanyName,
        locationName: body.LocationName,
        locationType: body.LocationType,
        description: body.Description,
        id: body.id,
        startDate: body.startDate,
        endDate: body.endDate,
        currently: body.currently, // Added the missing 'currently' property
      },
    })
    .catch((error) => {
      console.log("Error", error);
      return new Response(response, { status: 200 });
    });

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 403 });
  }
  return new Response(response, { status: 200 });
}
