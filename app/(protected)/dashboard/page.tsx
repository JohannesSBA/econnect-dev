import React from "react";
import Messages from "../components/Messages";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import FriendRequests from "../components/FriendRequests";

const page = async () => {
  const session = await getServerSession(options);
  return (
    <div className="w-screen h-screen bg-red-50 flex gap-12">
      <div className="sticky top-0 left-0 p-12 bg-white">
        <FriendRequests />
      </div>
      <Messages userId={session?.user.id as string} />
    </div>
  );
};

export default page;
