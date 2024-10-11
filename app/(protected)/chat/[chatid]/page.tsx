import ChatInput from "@/app/(protected)/components/ChatInput";
import Conversations from "@/app/(protected)/components/Conversations";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { Avatar, Link, Image } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";
import { GiWaterDrop } from "react-icons/gi";
import Messages from "../../components/Messages";
import Search from "../../components/SearchComponents/Search";
import SignOutButton from "../../components/SignOutButton";
import UserPicture from "../../components/UserPicture";
import { Friend } from "@/app/types/db";
import SideInfo from "../../components/SideInfo";
import PNav from "../../components/visualComponents/PNav";

interface PageProps {
  params: {
    chatId: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { chatid: string };
}) {
  const { chatid } = params;
  const session = await getServerSession(options);
  if (!session) notFound();

  const [id1, id2] = chatid.split("--");

  const friendId = id1 === session.user.id ? id2 : id1;
  const userId = id1 === session.user.id ? id1 : id2;

  const friendContent = await getUserContent(friendId);
  const userContent = await getUserContent(session.user.id);

  if (session.user.id !== userId) {
    notFound();
  }

  return { title: `Connected | ${friendContent.fullName} chat` };
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

  const [id1, id2] = chatid.split("--");

  const friendId = id1 === session.user.id ? id2 : id1;
  const userId = id1 === session.user.id ? id1 : id2;

  const userInfo = await getUserContent(session?.user.id as string);
  const friendContent = await getUserContent(friendId);

  const friends = userInfo.friends as unknown as Friend[];
  const friendsOf = userInfo.friendsOf as unknown as Friend[];
  const friendsList = friends.concat(friendsOf);

  if (session.user.id !== userId) {
    notFound();
  }

  return (
    <div className="h-screen w-screen overflow-clip font-PlusJakartaSans flex flex-col">
      <PNav />
      <div className="w-screen h-full overflow-clip flex bg-slate-100">
        <div className="w-1/5 hidden md:flex">
          <Messages
            userId={session?.user.id as string}
            friends={friendsList}
            role={userInfo?.role as string}
          />
        </div>
        <div className="w-full md:w-4/5 h-full md:border border-slate-300 flex">
          <div className="w-full h-full md:w-2/3 flex flex-col justify-between border border-slate-300 shadow-md m-1 p-1 py-10">
            <Link
              className="flex gap-4 p-4 rounded-2xl shadow-sm bg-zinc-100 backdrop-blur-lg"
              href={`/ec/${friendContent.id}`}
            >
              <div className="flex items-center">
                <Avatar
                  radius="lg"
                  size="lg"
                  src={`https://econnectbucket.s3.amazonaws.com/image/${friendContent.id}`}
                  className="flex items-center border-2"
                />
              </div>
              <h1 className="text-black flex flex-col justify-center font-bold">
                {friendContent.firstName} {friendContent.lastName}
              </h1>
            </Link>
            <Conversations
              chatPartner={friendId as string}
              chatId={userId as string}
              chatRoom={chatid}
            />
            <div className="absolute bottom-0 w-full md:w-2/4 bg-zinc-100">
              <ChatInput
                chatPartner={friendId}
                chatId={userId}
                chatRoom={chatid}
              />
            </div>
          </div>
          <div className="w-1/3 m-2 p-2 md:flex flex-col gap-3 items-center justify-between hidden">
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
