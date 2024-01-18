import ChatInput from "@/app/(protected)/components/ChatInput";
import Conversations from "@/app/(protected)/components/Conversations";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { Avatar, Link } from "@nextui-org/react";
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

  const friendContent = await getUserContent(friendId);

  if (session.user.id !== userId) {
    notFound();
  }

  return (
    <div className="w-screen h-[calc(100vh-5rem)] p-4 bg-slate-100 flex text-black">
      <div className="hidden w-1/4 h-full md:flex flex-col "></div>
      <div className="w-full md:w-3/4 h-full md:border border-slate-300 flex flex-col justify-between">
        <Link
          className="flex gap-4 p-4 rounded-2xl shadow-sm bg-zinc-100 backdrop-blur-lg"
          href={`/ec/${friendContent.id}`}
        >
          <div className="flex items-center">
            <Avatar
              radius="lg"
              size="lg"
              src={`https://econnectbucket.s3.amazonaws.com/profile/${friendContent.id}`}
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
        <ChatInput chatPartner={friendId} chatId={userId} chatRoom={chatid} />
      </div>
    </div>
  );
};

export default page;
