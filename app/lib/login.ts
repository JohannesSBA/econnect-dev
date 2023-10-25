// import prisma client
import hashPassword from "../helpers/hashPass";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./prisma";
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        //login uer
        await loginUserHandler(req, res);
    } else {
        return res.status(405);
    }
}
async function loginUserHandler(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "invalid inputs" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
            },
        });
        if (user && user.password === (await hashPassword(password))) {
            // exclude password from json response
            return res.status(200).json(exclude(user, ["password"]));
        } else {
            return res.status(401).json({ message: "invalid credentials" });
        }
    } catch (e) {
        console.log(e);
    }
}
// Function to exclude user password returned from prisma
function exclude(user: { [x: string]: any }, keys: string[]) {
    for (let key of keys) {
        delete user[key];
    }
    return user;
}
