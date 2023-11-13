import { PrismaClient } from "@prisma/client";
import { string } from "zod";

const prisma = new PrismaClient();

export default prisma;
