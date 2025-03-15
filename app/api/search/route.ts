import prisma from "@/app/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("q") as string;
    const decodedQuery = decodeURI(query);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20");
    const from = url.searchParams.get("from"); // Check if this is a dynamic search request

    if (!decodedQuery) {
      throw new Error("Invalid request");
    }

    const terms = decodedQuery.split(/\s+/).filter(Boolean);

    let users = [];
    let posts = [];
    let listings = [];

    // For dynamic searches, we use a more optimized approach with stricter matching
    // and smaller result sets for faster response times
    if (from === "dynamic") {
      // For dynamic search, we prioritize exact matches on important fields
      // and limit result counts for faster response
      users = await prisma.user.findMany({
        where: {
          OR: [
            { firstName: { contains: decodedQuery, mode: "insensitive" } },
            { lastName: { contains: decodedQuery, mode: "insensitive" } },
            { email: { contains: decodedQuery, mode: "insensitive" } },
          ],
        },
        take: pageSize,
      });

      posts = await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: decodedQuery, mode: "insensitive" } },
            { content: { contains: decodedQuery, mode: "insensitive" } },
          ],
        },
        take: pageSize,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          author: true,
          authorId: true,
          published: true,
        },
      });

      listings = await prisma.jobListing.findMany({
        where: {
          OR: [
            { title: { contains: decodedQuery, mode: "insensitive" } },
            { shortDescription: { contains: decodedQuery, mode: "insensitive" } },
          ],
        },
        take: pageSize,
        select: {
          id: true,
          title: true,
          location: true,
          shortDescription: true,
          jobType: true,
        },
      });
    } else {
      // For regular searches, use the original more comprehensive term-by-term search
      users = await prisma.user.findMany({
        where: {
          OR: terms.map((term) => ({
            OR: [
              { firstName: { contains: term, mode: "insensitive" } },
              { lastName: { contains: term, mode: "insensitive" } },
              { email: { contains: term, mode: "insensitive" } },
              { bio: { contains: term, mode: "insensitive" } },
              { location: { contains: term, mode: "insensitive" } },
              { title: { contains: term, mode: "insensitive" } },
            ],
          })),
        },
      });

      posts = await prisma.post.findMany({
        where: {
          OR: terms.map((term) => ({
            OR: [
              { content: { contains: term, mode: "insensitive" } },
              { title: { contains: term, mode: "insensitive" } },
            ],
          })),
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          author: true,
          authorId: true,
          categories: true,
          images: true,
          published: true,
          updatedAt: true,
        },
      });

      listings = await prisma.jobListing.findMany({
        where: {
          OR: terms.map((term) => ({
            OR: [
              { title: { contains: term, mode: "insensitive" } },
              { description: { contains: term, mode: "insensitive" } },
            ],
          })),
        },
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
        },
      });
    }

    const responsePayload = {
      users,
      posts,
      listings,
      currentPage: page,
      pageSize: pageSize,
    };

    return new Response(JSON.stringify(responsePayload), { status: 200 });
  } catch (error) {
    console.error("Error fetching search results:", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
