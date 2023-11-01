import { PrismaClient } from "@prisma/client";
import { string } from "zod";

const prisma = new PrismaClient();

export { prisma };

// export async function fetchDb(userEmail: string) {
//     const response = await prisma.user.findUnique({
//         where: {
//             email: userEmail,
//         },
//     });
//     return response;
// }
