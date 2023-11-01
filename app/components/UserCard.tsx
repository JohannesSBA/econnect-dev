import React from "react";
import { Card, Image } from "@nextui-org/react";
import { Session, getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";

const UserCard = async () => {
  const session = await getServerSession(options);

  return (
    <div className=" border-2 border-slate-200 rounded-md shadow-sm">
      <Card className="w-80 md:w-[600px] bg-transparent ml-6 p-2 flex justify-center">
        <div className="w-full h-full rounded-md border-2 border-slate-300">
          <Image
            src="https://nextui-docs-v2.vercel.app/images/album-cover.png"
            alt="NextUI Album Cover"
            className="m-5 rounded-full border-2 border-white md:w-full w-1/2"
          />
        </div>
        <div className="ml-4 p-2">
          <h1 className="font-bold text-2xl text-black ">
            {session?.user.name}
          </h1>
          <h2 className="text-slate-600 text-sm">(He/Him)</h2>
          <h2 className="text-slate-600 text-sm">
            Student at Fordham University
          </h2>
          <h2 className="text-slate-600 text-sm pt-2">Addis Ababa, Ethiopia</h2>
        </div>
      </Card>
    </div>
  );
};

export default UserCard;
