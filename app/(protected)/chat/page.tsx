import { Button, Image } from "@nextui-org/react";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { Avatar, Link, user } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { notFound, useRouter } from "next/navigation";
import { userInfo } from "os";
import React from "react";
import { GiWaterDrop } from "react-icons/gi";
import { Friend } from "@/app/types/db";
import Messages from "../components/Messages";
import Search from "../components/Search";
import SignOutButton from "../components/SignOutButton";
import UserPicture from "../components/UserPicture";
import SideInfo from "../components/SideInfo";

interface PageProps {
  params: {
    chatId: string;
  };
}

interface PageProps {
  params: {
    chatId: string;
  };
}

const page = async ({ params }: { params: { chatid: string } }) => {
  const { chatid } = params;
  const session = await getServerSession(options);
  if (!session) notFound();

  const userInfo = await getUserContent(session?.user.id as string);
  //   const friendContent = await getUserContent(friendId);

  const friends = userInfo.friends as unknown as Friend[];
  const friendsOf = userInfo.friendsOf as unknown as Friend[];
  const friendsList = friends.concat(friendsOf);

  //   if (session.user.id !== userId) {
  //     notFound();
  //   }

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
        <div className="w-4/5 flex">
          <div className="w-2/3 text-black p-4">
            <h1 className="text-bold text-2xl">Start Chatting</h1>
          </div>
          <div className="w-1/3 m-2 p-2 flex flex-col gap-3 items-center justify-between">
            <SideInfo
              user={userInfo}
              posts={userInfo.posts}
              applications={userInfo.jobApplications}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
