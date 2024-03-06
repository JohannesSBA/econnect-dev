import React from "react";
import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import RequestHandler from "../../components/RequestHandler";
import Link from "next/link";
import { userInfo } from "os";
import { GiWaterDrop } from "react-icons/gi";
import Messages from "../../components/Messages";
import Search from "../../components/Search";
import SignOutButton from "../../components/SignOutButton";
import UserPicture from "../../components/UserPicture";
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
      <div className="sticky bg-zinc-100 h-20 w-screen flex items-center px-6 gap-4 rounded-md shadow-lg backdrop-blur-md">
        <div className="flex gap-4">
          <Link
            href={"/employer-dashboard"}
            className="flex gap-4 text-blue-800"
          >
            <GiWaterDrop />
            <p className="hidden md:flex font-bold text-inherit">Econnect</p>
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg p-2 px-4 font-semibold text-[#6C6C6C]"
          >
            Dashboard
          </Link>
          <Link
            href="/"
            className="bg-[#4773C5]/40 rounded-lg p-2 px-4 font-semibold text-[#4773C5]"
          >
            Messages
          </Link>
          <Link
            href="/listings"
            className="rounded-lg p-2 px-4 font-semibold text-[#6C6C6C]"
          >
            Listings
          </Link>
        </div>
        <div className="w-5/6 hidden md:flex gap-3 justify-end">
          <Search />
          <UserPicture />
          <SignOutButton />
        </div>
      </div>
      <div className="w-screen h-full overflow-clip flex bg-slate-100">
        <div className="w-1/5">
          <Messages
            userId={session?.user.id as string}
            friends={friendsList}
            role={userInfo?.role as string}
          />
        </div>
        <div className="w-full md:w-3/4 h-full md:border border-slate-300 flex flex-col justify-between">
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
