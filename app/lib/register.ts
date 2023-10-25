import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import hashPassword from "../helpers/hashPass";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        await createUserHandler(req, res);
    } else {
        return new Response("Method Not Allowed", { status: 405 });
    }
}

async function createUserHandler(req: NextApiRequest, res: NextApiResponse) {
    const { name, email, password, id, phoneNumber }: User = req.body;
    const hashedPass = hashPassword(password);
    validateCredentials(email, password);
    const user = await prisma.user.create({
        data: {
            email: email,
            name: name,
            phoneNumber: phoneNumber,
            password: await hashedPass,
        },
    });
}
function validateCredentials(email: string, password: string) {
    const emailSchema = z.string().email("Invalid Email Address");
    const passwordSchema = z
        .string()
        .min(8, "Password must be atleast 8 characters");

    const emailResult = emailSchema.safeParse(email);
    const passwordResult = passwordSchema.safeParse(password);

    if (!emailResult.success) {
        return { success: false, error: emailResult.error.message };
    }
    if (!passwordResult.success) {
        return { success: false, error: passwordResult.error.message };
    }
    return { success: true };
}
