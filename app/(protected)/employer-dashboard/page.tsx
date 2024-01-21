import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import JobListing from "../components/JobListing";
import NewJobListing from "../components/NewJobListing";
import AllListings from "../components/AllListings";
import { User } from "@/app/types/db";

const Page = async () => {
  const session = await getServerSession(options);
  if (!session) {
    return;
  }

  const user = await getUserContent(session.user.id);

  if (user.role === "EMPLOYEE") redirect("/dashboard");

  return (
    <div className="bg-slate-100 w-screen h-[calc(100vh-5rem)] flex justify-center">
      <NewJobListing id={session.user.id} />
      <AllListings id={session.user.id} user={user.jobListing} />
    </div>
  );
};

export default Page;
