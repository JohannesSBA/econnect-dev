import React from "react";
import UserAbout from "../../components/UserAbout";
import UserCard from "../../components/UserCard";
import UserExperience from "../../components/UserExperience";
import EditContent from "../../components/EditContent";
import { getUserContent } from "@/app/helpers/getUser";

const page = async () => {
  const userInfo = await getUserContent();

  return (
    <div className="h-fit md:h-screen bg-slate-200">
      <div className="w-screen flex overflow-auto flex-col md:flex-row gap-2">
        <div className="w-full flex flex-col items-center bg-slate-200 pt-4 gap-2">
          <UserCard />
          <UserAbout userBio={userInfo.bio as string} />
          <EditContent
            userBio={userInfo.bio as string}
            userName={userInfo.firstName as string}
            userPronouns={userInfo.pronouns}
            userLocation={userInfo.location as string}
            userEducation={userInfo.education}
            userCPosition={userInfo.currentPosition as string}
            userTitle={userInfo.title as string}
          />
          <UserExperience />
        </div>
      </div>
    </div>
  );
};

export default page;
