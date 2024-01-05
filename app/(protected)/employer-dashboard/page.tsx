import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await getServerSession(options);
  if (!session) return;

  const userInfo = await getUserContent(session.user.id);

  const userRole = userInfo.role as string;

  if (userRole === "EMPLOYEE") {
    redirect("/dashboard");
  }

  if (userRole === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="bg-slate-100 w-screen h-[calc(100vh-6rem)]">
      p{/* Your component content goes here */}
    </div>
  );
};

export default Page;
