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

const page = async ({ params }: { params: { chatid: string } }) => {
  const { chatid } = params;
  const session = await getServerSession(options);
  if (!session) notFound();

  const [friendId, userId] = chatid.split("--");

  const friend = await getUserContent(friendId);

  const { user } = session;

  if (user.id !== userId) {
    notFound();
  }

  return (
    <div className="w-screen h-screen bg-red-50 text-black">
      <Conversations
        chatPartner={friendId as string}
        partnerName={friend.fullName as string}
        chatId={userId as string}
      />
      <ChatInput chatPartner={friendId} chatId={userId} />
    </div>
  );
};

export default page;
