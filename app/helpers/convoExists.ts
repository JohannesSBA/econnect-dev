import { getServerSession } from "next-auth";
import { getUserContent } from "@/app/helpers/getUser";
import prisma from "@/app/lib/prisma";
import { options } from "../api/auth/[...nextauth]/options";
import { Friend } from "@/app/types/db";

export const convoExists = async () => {
    const session = await getServerSession(options);
    const user = await getUserContent(session?.user.id as string);

    // Vallidations for sending a message
    if (!session) return new Response("Unauthorized", { status: 401 });

    const exist = await prisma.user.findMany({
        where: {
            OR: [
                {
                    messagesSent: {
                        some: {
                            recipientId: user.id,
                        },
                    },
                },
                {
                    messagesReceived: {
                        some: {
                            senderId: user.id,
                        },
                    },
                },
            ],
        },
    });

    return exist as unknown as Friend[];
};
