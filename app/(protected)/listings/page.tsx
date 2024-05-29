import React from "react";
import AllListings from "../components/AllListings";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import JobListing from "../components/JobListing";

const page = async () => {
  const session = await getServerSession(options);
  const user = getUserContent(session?.user.id as string);
  return (
    <div>
      <AllListings id={session?.user.id as string} user={user} />
      <JobListing />
    </div>
  );
};

export default page;
