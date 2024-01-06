import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import JobListing from "../components/JobListing";
import NewJobListing from "../components/NewJobListing";

const Page = async () => {
  const session = await getServerSession(options);
  if (!session) return;

  const userInfo = await getUserContent(session.user.id);

  const userRole = userInfo.role as string;

  return (
    <div className="bg-slate-100 w-screen h-[calc(100vh-6rem)] flex justify-center">
      <JobListing
        id={""}
        createdAt={"11/21/24"}
        updatedAt={""}
        title={"Engineer"}
        description={
          "Full Stack Engineer Full Stack Engineer Full Stack Engineer Full Stack Engineer Full Stack Engineer"
        }
        location={"UK"}
        company={"Mehre"}
        jobType={"Full-Time"}
      />
      <NewJobListing id={session.user.id} />
    </div>
  );
};

export default Page;
