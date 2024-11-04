import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  const offset = body.page * body.limit;

  // Build the search filter based on the search term if it exists
  const searchFilter = body.searchTerm
    ? {
        OR: [
          {
            title: {
              contains: body.searchTerm,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            location: {
              contains: body.searchTerm,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            description: {
              contains: body.searchTerm,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            shortDescription: {
              contains: body.searchTerm,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }
    : {};

  const getJobs = await prisma.jobListing.findMany({
    where: searchFilter, // Apply the search filter here
    skip: offset,
    take: body.limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      location: true,
      createdAt: true,
      updatedAt: true,
      applicant: true,
      description: true,
      jobType: true,
      postedById: true,
      shortDescription: true,
      expireCode: true,
      Expired: true,
      expireDate: true,
      postedBy: true,
      hired: true,
      HumanScreened: true,
      ComputerScreened: true,
    },
  });

  return new Response(JSON.stringify(getJobs), { status: 201 });
}
