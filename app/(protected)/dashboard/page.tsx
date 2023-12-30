import React from "react";
import Messages from "../components/Messages";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import FriendRequests from "../components/FriendRequests";
import { getUserContent } from "@/app/helpers/getUser";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(options);
  const user = await getUserContent(session?.user.id as string);

  if (user.gotStarted == false) {
    redirect("/dashboard/get-started");
  }

  return <div className="w-screen h-screen bg-red-50 flex gap-12"></div>;
};

export default page;
