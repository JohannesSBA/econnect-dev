import { z } from "zod";


export default function validateCredentials(email: string, password: string) {
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