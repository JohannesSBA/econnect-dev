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
import PNav from "../components/visualComponents/PNav";

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
      <PNav />
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
