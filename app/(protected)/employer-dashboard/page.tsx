import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  return <div>{/* Your component content goes here */}</div>;
};

export default Page;
