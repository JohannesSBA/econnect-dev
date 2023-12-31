import prisma from "@/app/lib/prisma";

export async function GET(req: Request, res: Response) {
  try {
    // TODO: POSSIBLY ADD MORE SOPHISTICATION
    const query = req.url.split("q=").at(1) as string;
    const decodedQuery = decodeURI(query);

    if (typeof query !== "string") {
      throw new Error("Invalid request");
    }

    const terms = decodedQuery.split(/\s+/).filter(Boolean);

    const users = await prisma.user.findMany({
      where: {
        OR: terms.map((term) => ({
          OR: [
            { firstName: { contains: term, mode: "insensitive" } },
            { lastName: { contains: term, mode: "insensitive" } },
            { email: { contains: term, mode: "insensitive" } },
            { phoneNumber: { contains: term, mode: "insensitive" } },
          ],
        })),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        title: true,
        email: true,
        bio: true,
        role: true,
        posts: {
          select: {
            // Include only the necessary fields from the 'posts' relation
            id: true,
            title: true,
            // Add other fields you want to include
          },
        },
        // Add other fields you want to include
      },
    });

    const stringfiedUsers = JSON.stringify(users);

    return new Response(stringfiedUsers, { status: 200 });
  } catch (error) {
    return new Response("Something went wrong", { status: 500 });
  }

  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 403 });
  }
}
