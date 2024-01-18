import React, { useState } from "react";
import { Avatar, Button } from "@nextui-org/react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { chatHrefConstructor } from "@/app/lib/utils";

interface avatarProps {
  friendId: string;
  firstName: string;
  lastName: string;
  user: string;
}

export default function App({
  firstName,
  lastName,
  friendId,
  user,
}: avatarProps) {
  const router = useRouter();
  const chatroom = chatHrefConstructor(friendId, user);

  return (
    <Button
      onClick={() => {
        router.push(`/chat/${chatroom}`);
      }}
      className="w-full justify-start bg-slate-100 hover:bg-white group"
    >
      <div className="flex w-full justify-between">
        <div className="flex w-full gap-2 justify-normal">
          <div className=" flex items-center">
            <Avatar
              radius="lg"
              size="sm"
              src={`https://econnectbucket.s3.amazonaws.com/profile/${friendId}`}
              className="flex items-center border-2"
            />
          </div>

          <h1 className="text-black flex flex-col justify-center font-bold">
            {firstName} {lastName}
          </h1>
        </div>
        <div className="p-4 w-12">
          <AiOutlineArrowRight />
        </div>
      </div>
    </Button>
  );
}
