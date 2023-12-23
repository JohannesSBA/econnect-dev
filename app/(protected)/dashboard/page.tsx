import React from "react";
import Messages from "../components/Messages";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

const page = async () => {
  const session = await getServerSession(options);
  return (
    <div>
      <Messages userId={session?.user.id as string} />
    </div>
  );
};

export default page;
