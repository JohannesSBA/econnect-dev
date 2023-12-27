import React from "react";
import { getServerSession } from "next-auth";
import Messages from "../../components/Messages";
import { options } from "@/app/api/auth/[...nextauth]/options";

const page = async () => {
  const session = await getServerSession(options);
  return (
    <div className="w-screen h-screen bg-red-50 flex gap-12">
      <Messages userId={session?.user.id as string}></Messages>
    </div>
  );
};

export default page;
