import React, { useEffect, useState } from "react";
import { Badge, Avatar, Button } from "@nextui-org/react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getPosts";

interface avatarProps {
  friendId: string;
  firstName: string;
  lastName: string;
  pic: string;
  user: string;
}

export default function App({
  firstName,
  lastName,
  pic,
  friendId,
  user,
}: avatarProps) {
  const router = useRouter();
  const [userId, setUserId] = useState<string>();

  return (
    <Button
      onClick={() => {
        router.push(`/dashboard/chat/${friendId}--${user}`);
      }}
      className="w-full justify-start p-12 m-0 bg-white hover:bg-slate-100 group"
    >
      <div className="flex w-full justify-between">
        <div className="flex w-full gap-2 justify-normal">
          <Avatar radius="lg" size="lg" src={pic} />
          <h1 className="text-black flex flex-col justify-center font-bold">
            {firstName} {lastName}
          </h1>
        </div>
        <div className="p-4 w-12 h-12 rounded-full bg-white group-hover:bg-blue-600 group-hover:text-white ">
          <AiOutlineArrowRight />
        </div>
      </div>
    </Button>
  );
}
