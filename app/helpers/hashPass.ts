import bcrypt from "bcryptjs";

export default async function hashPassword(unHashPass: string) {
    return await bcrypt.hash(unHashPass, 10).then(function (hash: string) {
        return hash;
    });
}
