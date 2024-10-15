import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { getServerSession } from "next-auth/next";
import React from "react";
import Image from "next/image";
import { User } from "@/app/types/db";
import { Friend } from "@/app/types/db";
import { notFound } from "next/navigation";
import { Button } from "@nextui-org/react";
import { chatHrefConstructor } from "@/app/lib/utils";
import Link from "next/link";

const page = async () => {
  const session = await getServerSession(options);
  if (!session) notFound();

  const userInfo = await getUserContent(session?.user.id as string);
  //   const friendContent = await getUserContent(friendId);

  const friends = userInfo.friends as unknown as Friend[];
  const friendsOf = userInfo.friendsOf as unknown as Friend[];
  const friendsList = friends.concat(friendsOf);

  return (
    <div className="w-screen md:h-screen overflow-clip bg-slate-100 flex flex-col md:flex-row justify-center font-PlusJakartSans">
      <div className="h-full w-1/2 flex flex-col overflow-scroll p-6">
        {friendsList.map((friend) => (
          <div
            key={friend.id}
            className=" flex flex-col gap-4 shadow-md rounded-lg text-black"
          >
            <div className="flex p-6 gap-2 justify-between">
              <div>
                <Image
                  src={`https://econnectbucket.s3.amazonaws.com/image/${friend.id}`}
                  alt="Application Image"
                  width={50}
                  height={50}
                  className="rounded-full"
                />

                <div className="flex flex-col">
                  <p className="text-lg font-semibold">
                    {friend.firstName + " " + friend.lastName}
                  </p>
                  <p className="text-sm text-slate-400">{friend.email}</p>
                </div>
              </div>
              <div className="flex gap-2 justify-center items-center">
                <Button
                  color="primary"
                  as={Link}
                  href={`/chat/${chatHrefConstructor(
                    friend.id,
                    session.user.id
                  )}`}
                >
                  Message
                </Button>
                <Button color="danger">Unfriend</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="h-full w-1/2"></div>
    </div>
  );
};

export default page;
