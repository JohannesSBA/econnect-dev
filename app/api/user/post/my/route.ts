import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
    if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 403 });
    }
    const body = await req.json();
    try {
        const userId = body.userId.id;
        const posts = await prisma.post.findMany({
            where: { authorId: userId },
        });
        const stringifiedPosts = JSON.stringify(posts);

        return new Response(stringifiedPosts, { status: 200 });
    } catch (error) {
        return new Response("Something went wrong", { status: 500 });
    }
}
