import ChatInput from "@/app/(protected)/components/ChatInput";
import Conversations from "@/app/(protected)/components/Conversations";
import Messages from "@/app/(protected)/components/Messages";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import prisma from "@/app/lib/prisma";
import axios from "axios";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React, { useState } from "react";

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

  const [friendId, userId] = chatid.split("--");

  const friendContent = await getUserContent(friendId);

  const { user } = session;

  if (user.id !== userId) {
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

  const [friendId, userId] = chatid.split("--");

  const friendContent = await getUserContent(friendId);
  const userContent = await getUserContent(session.user.id);

  const { user } = session;

  if (user.id !== userId) {
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
      <div className="w-3/4 h-full p-8 rounded-2xl ml-3 border-2 border-slate-300 flex flex-col justify-between">
        <Conversations
          chatPartner={friendId as string}
          partnerName={friendContent.fullName as string}
          chatId={userId as string}
          userName={userContent.fullName as string}
        />
        <ChatInput chatPartner={friendId} chatId={userId} />
      </div>
    </div>
  );
};

export default page;
