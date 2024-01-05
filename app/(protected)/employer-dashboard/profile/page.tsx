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

const page = async () => {
  const session = await getServerSession(options);
  const userInfo = await getUserContent(session?.user.id as string);

  if (userInfo.role === "EMPLOYEE") {
    redirect("/dashboard/profile");
  }

  return (
    <div className="w-screen h-screen bg-white flex">
      <div className="w-1/3 h-full ">
        <div className="h-2/5 w-full overflow-clip flex flex-col justify-center items-center">
          <ProfileImage image={userInfo.image as string} />
          <div className="fixed top-0 right-0">
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
        <div className="h-3/5 w-full  flex flex-col gap-8 items-center mt-12">
          <div className="mx-4 w-5/6 h-10 bg-slate-50 rounded-md flex items-center p-8">
            <h1 className="font-bold text-2xl text-black">
              <p className="uppercase font-extralight text-xs">full name</p>
              {userInfo.fullName}
            </h1>
          </div>
          <div className="mx-4 w-5/6 h-10 bg-slate-50 rounded-md flex items-center p-8">
            <h1 className="font-bold text-2xl text-black">
              <p className="uppercase font-extralight text-xs">Pronouns</p>(
              {userInfo.pronouns})
            </h1>
          </div>
          <div className="mx-4 w-5/6 h-10 bg-slate-50 rounded-md flex items-center p-8">
            <h1 className="font-bold text-2xl text-black">
              <p className="uppercase font-extralight text-xs">
                Current Position
              </p>
              {userInfo.currentPosition}
            </h1>
          </div>

          <div className="mx-4 w-5/6 h-10 bg-slate-50 rounded-md flex items-center p-8">
            <h1 className="font-bold text-2xl text-black">
              <p className="uppercase font-extralight text-xs">Location</p>
              {userInfo.location}
            </h1>
          </div>
        </div>
      </div>
      <div className="w-1/3 h-full flex flex-col">
        <UserAbout userBio={userInfo.bio as string} />
        <UserEducation userInfo={userInfo} />
      </div>

      <div className="w-1/3 h-full flex flex-col"></div>
    </div>
  );
};

export default page;
