import ChatInput from "@/app/(protected)/components/functionComponents/ChatInput";
import Conversations from "@/app/(protected)/components/visualComponents/Conversations";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { Avatar, Link, user } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";
import { GiWaterDrop } from "react-icons/gi";
import Search from "../../components/SearchComponents/Search";
import SignOutButton from "../../components/functionComponents/SignOutButton";
import { Friend } from "@/app/types/db";
import ProtectedNav from "../../components/visualComponents/ProtectedNav";
import Messages from "../../components/visualComponents/Messages";
import SideInfo from "../../components/visualComponents/SideInfo";

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

  const friendsList = userInfo.friends as unknown as Friend[];

  if (session.user.id !== userId) {
    notFound();
  }

  return (
    <div className="h-screen w-screen overflow-clip font-PlusJakartaSans flex flex-col">
      <ProtectedNav
        userInfoId={userInfo.id as string}
        userName={userInfo.firstName + " " + userInfo.lastName}
        userEmail={userInfo.email as string}
      />
      <div className="w-screen h-full overflow-clip flex bg-slate-100">
        <div className="w-1/5 hidden md:flex">
          <Messages
            userId={session?.user.id as string}
            friends={friendsList}
            role={userInfo.role ?? ""}
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
              applications={userInfo.applicant}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
