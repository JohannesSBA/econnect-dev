import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import hashPassword from "@/app/helpers/hashPass";


export async function POST(req: Request, res: Response) {
    console.log('p')

    const body = await req.json();
    console.log(body.email)
    const hashedPass = await hashPassword(body.password);

    await prisma.user.create({
        data:{
            email: body.email,
            password: hashedPass,
            name: body.name,
            phoneNumber: body.phoneNumber,
            id: 1,
        }
    })

    if (req.method !== 'POST') {
        return new Response('Method not allowed', {status: 403})
      }

    


    
    // // validateCredentials(email, password);
    // const data = JSON.parse(req.body)
    // console.log('this is req' + req.body)
    // console.log('this is data'+ data)
    // console.log('this is parse' + JSON.parse(req.body))


    // await prisma.user.create({
    //     data: {
    //         email: email,
    //         name: name,
    //         phoneNumber: phoneNumber,
    //         password: password,
    //         id: '1sss',
    //     },
    // });
    return new Response("Some data", { status: 200 });
}

// function validateCredentials(email: string, password: string) {
//     const emailSchema = z.string().email("Invalid Email Address");
//     const passwordSchema = z
//         .string()
//         .min(8, "Password must be atleast 8 characters");

//     const emailResult = emailSchema.safeParse(email);
//     const passwordResult = passwordSchema.safeParse(password);

//     if (!emailResult.success) {
//         return { success: false, error: emailResult.error.message };
//     }
//     if (!passwordResult.success) {
//         return { success: false, error: passwordResult.error.message };
//     }
//     return { success: true };
// }
