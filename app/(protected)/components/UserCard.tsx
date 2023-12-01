import React from "react";
import { Card, Image } from "@nextui-org/react";
import { Session, getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import EditContent from "./EditContent";
import { getUserContent } from "@/app/helpers/getUser";

const UserCard = async () => {
  const userInfo = await getUserContent();

  return (
    <div className="w-screen border-2 border-slate-200 rounded-md shadow-sm flex justify-center">
      <Card className="bg-transparent ml-6 p-2 flex justify-center w-4/6">
        <div className="w-full h-full rounded-md bg-no-repeat bg-[url(https://media.licdn.com/dms/image/D4E16AQFuAM3pbTcEDA/profile-displaybackgroundimage-shrink_350_1400/0/1679969544499?e=1706745600&v=beta&t=OdEcXq5uVWKSJwezbHOSpeS-XOzm9YfA_J7MkJqbXw0)] ">
          <div className="w-48">
            <Image
              src={userInfo.image}
              alt="NextUI Album Cover"
              className="m-5 rounded-full border-4"
            />
          </div>
        </div>
        <div className="ml-4 p-2">
          <h1 className="font-bold text-2xl text-black ">
            {userInfo.fullName}
          </h1>
          <h2 className="text-slate-600 text-sm">({userInfo.pronouns})</h2>
          <h2 className="text-slate-600 text-sm">{userInfo.currentPosition}</h2>
          <h2 className="text-slate-600 text-sm pt-2">{userInfo.location}</h2>
        </div>
      </Card>
    </div>
  );
};

export default UserCard;
