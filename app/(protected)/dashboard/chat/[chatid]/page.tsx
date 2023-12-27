import ChatInput from "@/app/(protected)/components/ChatInput";
import Messages from "@/app/(protected)/components/Messages";
import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React, { useState } from "react";

interface PageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const session = await getServerSession(options);
    const res = await prisma.conversation.findMany({
      where: {
        id: session?.user.id,
      },
      select: {
        messages: true,
      },
    });
  } catch (error) {
    notFound();
  }
}

const page = async ({ params }: { params: { chatid: string } }) => {
  const { chatid } = params;
  const session = await getServerSession(options);
  if (!session) notFound();

  const [friendId, userId] = chatid.split("--");

  const { user } = session;

  getChatMessages(userId);

  if (user.id !== userId) {
    notFound();
  }

  return (
    <div className="w-screen h-screen bg-red-50 text-black">
      <ChatInput chatPartner={friendId} chatId={userId} />
    </div>
  );
};

export default page;
