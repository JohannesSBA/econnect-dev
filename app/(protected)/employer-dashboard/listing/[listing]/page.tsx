import ChatInput from "@/app/(protected)/components/ChatInput";
import Conversations from "@/app/(protected)/components/Conversations";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getApplicants } from "@/app/helpers/getApplicants";
import { getUserContent } from "@/app/helpers/getUser";
import { Avatar, Link } from "@nextui-org/react";
import axios from "axios";
import { get } from "http";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    listing: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { listing: string };
}) {
  const { listing } = params;
  const session = await getServerSession(options);
  if (!session) notFound();

  const userInfo = await getUserContent(session.user.id);
  let flag = false;

  userInfo.jobListing?.forEach((job) => {
    job.id === listing ? (flag = true) : null;
  });

  if (flag == false) {
    notFound();
  }

  return { title: `Applications | ${userInfo.firstName} listing` };
}

interface PageProps {
  params: {
    listing: string;
  };
}

const page = async ({ params }: { params: { listing: string } }) => {
  const { listing } = params;
  const session = await getServerSession(options);
  if (!session) notFound();

  const userInfo = await getUserContent(session.user.id);
  let flag = false;

  userInfo.jobListing?.forEach((job) => {
    job.id === listing ? (flag = true) : null;
  });

  if (flag == false) {
    notFound();
  }

  const applications = await getApplicants(listing);

  console.log(applications);

  return (
    <div className="w-screen h-[calc(100vh-5rem)] p-4 bg-slate-100 flex text-black">
      <div className="hidden w-1/4 h-full md:flex flex-col text-black">
        hellur
      </div>
      {/* <div className="w-full md:w-3/4 h-full md:border border-slate-300 flex flex-col justify-between">
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
      </div> */}
    </div>
  );
};

export default page;
