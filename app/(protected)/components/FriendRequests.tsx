import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";
import { Avatar, Button } from "@nextui-org/react";
import { MdCancel } from "react-icons/md";
import RequestHandler from "./RequestHandler";

export default async function FriendRequests() {
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

  return (
    <>
      <div className="text-black h-screen bg-red-50">
        <RequestHandler
          incomingFriendRequest={pendingList}
          sessionEmail={session.user.email as string}
        />
        {/* {pendingList.map(
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
                <Button
                  onClick={() =>
                    acceptFriend(session.user.email as string, pFriends.id)
                  }
                >
                  <FaCheckCircle />
                </Button>
                <Button
                  onClick={() =>
                    rejectFriend(session.user.email as string, pFriends.id)
                  }
                >
                  <MdCancel />
                </Button>
              </div>
            </div>
          )
        )} */}
      </div>
    </>
  );
}
