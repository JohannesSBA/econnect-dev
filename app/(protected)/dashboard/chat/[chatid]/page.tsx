import ChatInput from "@/app/(protected)/components/ChatInput";
import Conversations from "@/app/(protected)/components/Conversations";
import Messages from "@/app/(protected)/components/Messages";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { Avatar } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

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

  return { title: `FriendZone | ${friendContent.fullName} chat` };
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

  const friendContent = await getUserContent(friendId);

  if (session.user.id !== userId) {
    notFound();
  }

  return (
    <div className="w-screen h-[calc(100vh-5rem)] p-4 bg-slate-100 flex text-black">
      <div className="w-1/4 h-full flex flex-col ">
        <h1 className="font-semibold pt-8 pl-8">Friends List</h1>
        <div className="w-full">
          <Messages userId={userId} />
        </div>
      </div>
      <div className="w-3/4 h-full rounded-2xl ml-3 border-2 border-slate-300 flex flex-col justify-between">
        <div className="flex gap-4 p-4 rounded-2xl shadow-sm bg-zinc-100 backdrop-blur-lg">
          <div className="flex items-center">
            <Avatar
              radius="lg"
              size="lg"
              src={`https://econnectbucket.s3.amazonaws.com/${friendContent.id}`}
              className="flex items-center border-2"
            />
          </div>
          <h1 className="text-black flex flex-col justify-center font-bold">
            {friendContent.firstName} {friendContent.lastName}
          </h1>
        </div>
        <Conversations
          chatPartner={friendId as string}
          chatId={userId as string}
          chatRoom={chatid}
        />
        <ChatInput chatPartner={friendId} chatId={userId} chatRoom={chatid} />
      </div>
    </div>
  );
};

export default page;
