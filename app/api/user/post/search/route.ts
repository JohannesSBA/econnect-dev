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

        const posts = await prisma.post.findMany({
            where: {
                OR: terms.map((term) => ({
                    OR: [
                        { content: { contains: term, mode: "insensitive" } },
                        { title: { contains: term, mode: "insensitive" } },
                    ],
                })),
            },
            select: {},
        });

        const stringifiedPosts = JSON.stringify(posts);
        return new Response(stringifiedPosts, { status: 200 });
    } catch (error) {
        return new Response("Something went wrong", { status: 500 });
    }

    if (req.method !== "GET") {
        return new Response("Method not allowed", { status: 403 });
    }
}
