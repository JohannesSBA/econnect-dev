import React from "react";
import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import RequestHandler from "../../components/RequestHandler";

const page = async () => {
  const session = await getServerSession(options);

  if (!session) return;

  const getPending = await prisma.user.findMany({
    where: {
      email: session.user.email as string,
    },
    select: {
      pendingFriendRequest: true,
    },
  });

  const pendingList = getPending[0].pendingFriendRequest;

  return (
    <div className="w-screen h-screen scroll bg-slate-50 flex">
      <div className="w-1/2"></div>
      <div className="w-1/2 mt-12">
        <div className="text-black min-h-12 rounded-md bg-slate-100 shadow-md border border-slate-500 text-semibold flex items-center p-6 mr-6">
          <RequestHandler
            incomingFriendRequest={pendingList}
            sessionEmail={session.user.email as string}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
