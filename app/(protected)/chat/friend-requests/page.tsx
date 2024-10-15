import React from "react";
import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import RequestHandler from "../../components/RequestHandler";
import Link from "next/link";
import { userInfo } from "os";
import { GiWaterDrop } from "react-icons/gi";
import Messages from "../../components/Messages";
import PNav from "../../components/visualComponents/PNav";
import { getUserContent } from "@/app/helpers/getUser";
import { Friend } from "@/app/types/db";

const page = async () => {
  const session = await getServerSession(options);

  if (!session) return;

  const userInfo = await getUserContent(session?.user.id as string);
  //   const friendContent = await getUserContent(friendId);

  const friends = userInfo.friends as unknown as Friend[];
  const friendsOf = userInfo.friendsOf as unknown as Friend[];
  const friendsList = friends.concat(friendsOf);

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
    <div className="h-screen w-screen overflow-clip font-PlusJakartaSans flex flex-col">
      <PNav />
      <div className="w-screen h-full overflow-clip flex bg-slate-100">
        <div className="w-1/5">
          <Messages
            userId={session?.user.id as string}
            friends={friendsList}
            role={userInfo?.role as string}
          />
        </div>
        <div className="w-full md:w-3/4 h-full md:border border-slate-300 flex flex-col p-6">
          <h1 className="text-bold text-black text-2xl">Friends Requests</h1>
          <RequestHandler
            incomingFriendRequest={pendingList}
            sessionEmail={session.user.email as string}
          />
          ;
        </div>
      </div>
    </div>
  );
};

export default page;
