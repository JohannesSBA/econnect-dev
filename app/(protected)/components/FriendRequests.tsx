import React from "react";
import FriendBadge from "./FriendBadge";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";
import { Avatar } from "@nextui-org/react";
import { AiOutlineArrowRight } from "react-icons/ai";

export default async function Messages() {
  const session = await getServerSession(options);

  if (!session) return;

  const getPending = await prisma.user.findMany({
    where: {
      email: session.user.email as string,
    },
    select: {
      pendingFriendRequest: true,
    },
  });

  const pendingList = getPending[0].pendingFriendRequest;

  console.log("this is get Friends", pendingList);
  // setPending(getFriends);

  return (
    <>
      <div className="text-black w-24 h-24 bg-red-50">
        {pendingList.map(
          (pFriends: {
            id: string;
            firstName: string | null;
            lastName: string | null;
            image: string | null;
          }) => (
            <div
              key={pFriends.id as string}
              className="flex w-full justify-between h-full"
            >
              <div className="flex w-full gap-2 justify-normal">
                <Avatar radius="lg" size="lg" src={pFriends.image as string} />
                <h1 className="text-black flex flex-col justify-center font-bold">
                  {pFriends.firstName as string} {pFriends.lastName as string}
                </h1>
              </div>
              <div className="p-4 w-12 h-12 rounded-full bg-white group-hover:bg-blue-600 group-hover:text-white ">
                <AiOutlineArrowRight />
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
