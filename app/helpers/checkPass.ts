import bcrypt from "bcryptjs";

export default async function isSamePass(unHashPass: string, hashPass: string) {
    const result = await bcrypt
        .compare(unHashPass, hashPass);
    return result;
}
