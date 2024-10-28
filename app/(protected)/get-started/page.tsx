import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { getServerSession } from "next-auth";
import React from "react";
import { User } from "@/app/types/db";
import { redirect } from "next/navigation";
import StarterForms from "../components/functionComponents/StarterForms";

const page = async () => {
    const session = await getServerSession(options);
    const user = (await getUserContent(
        session?.user.id as string
    )) as unknown as User;

    if (user.role === "EMPLOYER") {
        redirect("/employer-dashboard");
    }
    if (user.gotStarted == true) {
        redirect("/dashboard");
    }

    return (
        <div className="bg-slate-100 w-screen h-screen flex justify-center items-center text-slate-800">
            <StarterForms user={user} />
        </div>
    );
};

export default page;
