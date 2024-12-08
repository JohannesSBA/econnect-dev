import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import prisma from "../lib/prisma";

const getUserPosts = async () => {
    try {
        const session = await getServerSession(options);

        if (!session || !session.user) {
            throw new Error("User is not authenticated");
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { friends: { select: { id: true } } },
        });
        const friendIds = user?.friends.map((friend) => friend.id); // Add null check for user

        const posts = await prisma.post.findMany({
            where: {
                authorId: { in: friendIds }, // Ensure `userId` matches the schema field
            },

            include: {
                likes: true,
                comments: {
                    select: {
                        id: true,
                        authorId: true,
                        author: {
                            select: {
                                firstName: true,
                                lastName: true,
                                id: true,
                            },
                        },
                        content: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                author: {
                    select: {
                        firstName: true,
                        lastName: true,
                        id: true,
                    },
                },
                savedBy: true,
            },
            orderBy: { createdAt: "desc" },
        });

        if (!posts || posts.length === 0) {
            throw new Error("No posts found for the user");
        }

        return posts; // Returning posts directly
    } catch (error) {
        console.error("Error in getUserPosts:", error);
        return { error: "Unable to retrieve user posts" };
    }
};

export { getUserPosts };
