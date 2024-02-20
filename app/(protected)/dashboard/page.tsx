import React from "react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { redirect } from "next/navigation";
import JobListing from "../components/JobListing";

const page = async () => {
  const session = await getServerSession(options);
  const user = await getUserContent(session?.user.id as string);

  if (user.role === "EMPLOYER") redirect("/employer-dashboard");
  if (user.gotStarted == false) redirect("/dashboard/get-started");

  return (
    <div className="w-screen h-screen bg-red-50 flex gap-12 justify-center">
      {/* <JobListing /> */}
    </div>
  );
};

export default page;
