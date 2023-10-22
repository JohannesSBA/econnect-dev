import { z } from 'zod'

export default async function POST(request: Request){
    try {
        const {email,password} = await request.json();
        //Password and Email Validation
        validateCredentials(email,password);
        console.log(email,password)
    } catch (error) {
        console.log(error)
    }
}

function validateCredentials(email: string, password: string){
    const emailSchema = z.string().email('Invalid Email Address');
    const passwordSchema = z.string().min(8,"Password must be atleast 8 characters")

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