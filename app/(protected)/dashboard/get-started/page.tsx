import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { getServerSession } from "next-auth";
import React from "react";
import StarterForms from "../../components/StarterForms";
import { User } from "@/app/types/db";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(options);
  const user = (await getUserContent(
    session?.user.id as string
  )) as unknown as User;

  if (user.gotStarted == true) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-slate-100 w-screen h-[calc(100vh-5rem)] flex flex-col justify-center items-center text-black">
      <h1>Get Started</h1>
      <StarterForms user={user} />
    </div>
  );
};

export default page;
