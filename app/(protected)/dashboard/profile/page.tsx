import React from "react";
import UserAbout from "../../components/UserAbout";
import EditContent from "../../components/EditContent";
import { getUserContent } from "@/app/helpers/getUser";
import { Card, Image } from "@nextui-org/react";
import ProfileImage from "../../components/ProfileImage";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import UserEducation from "../../components/UserEducation";
import { redirect } from "next/navigation";
import UploadResume from "../../components/UploadResume";

const page = async () => {
  const session = await getServerSession(options);
  const userInfo = await getUserContent(session?.user.id as string);

  if (userInfo.role === "EMPLOYER") {
    redirect("/employer-dashboard/profile");
  }

  return (
    <div className="w-screen h-[calc(100vh-5rem)] flex flex-col bg-slate-100">
      <div className="h-1/4 w-full flex ml-12 mt-12 border-b-2 pb-6 justify-between">
        <div className="flex gap-4">
          <ProfileImage image={userInfo.image as string} />
          <h1 className="font-bold text-2xl text-black h-full flex flex-col justify-center">
            {userInfo.fullName}
            <span className="text-sm font-extralight text-slate-600 ml-2 flex flex-col">
              <p>{userInfo.email}</p>
              <p>{userInfo.pronouns}</p>
              <p>{userInfo.location}</p>
            </span>
          </h1>
        </div>
        <div className="flex justify-center items-center mr-16">
          <EditContent
            userBio={userInfo.bio as string}
            userName={userInfo.firstName as string}
            userPronouns={userInfo.pronouns}
            userLocation={userInfo.location as string}
            userEducation={userInfo.education}
            userCPosition={userInfo.currentPosition as string}
            userTitle={userInfo.title as string}
          />
        </div>
      </div>
      <div className="h-full w-full flex px-6">
        <div className="w-1/3 h-full flex-1">
          <UserAbout userBio={userInfo.bio as string} />
        </div>
        <div className="w-1/3 h-full flex-1">
          <UserAbout userBio={userInfo.bio as string} />
        </div>
        <div className="w-1/3 h-full flex-1">
          <UserEducation userInfo={userInfo} />
        </div>
      </div>
    </div>
  );
};

export default page;
