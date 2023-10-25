import { PrismaClient } from "@prisma/client";
import { string } from "zod";

const prisma = new PrismaClient();

export { prisma };

export async function fetchDb(userId: string) {
    const response = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    return response;
}
