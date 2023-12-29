import React from "react";
import Messages from "../components/Messages";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import FriendRequests from "../components/FriendRequests";

const page = async () => {
  const session = await getServerSession(options);
  return <div className="w-screen h-screen bg-red-50 flex gap-12"></div>;
};

export default page;
