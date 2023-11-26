import React from "react";
import UserAbout from "../../components/UserAbout";
import UserCard from "../../components/UserCard";
import UserExperience from "../../components/UserExperience";
import { getUserContent } from "./page";

export const page = async () => {
  const userInfo = await getUserContent();

  return (
    <div className="h-fit md:h-screen bg-slate-200">
      <div className="w-screen flex overflow-auto flex-col md:flex-row gap-2">
        <div className="w-full md:w-1/2 flex flex-col items-center bg-slate-200 pt-4 gap-2">
          <UserCard />
          <UserAbout
            userBio={userInfo.bio as string}
            userName={userInfo.name as string}
            userPronouns={userInfo.pronouns as string}
            userLocations={userInfo.location as string}
            userEducation={userInfo.education as string}
            userCPosition={userInfo.currentPosition as string}
            userTitle={userInfo.title as string}
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center bg-slate-200 gap-2">
          <UserExperience />
        </div>
      </div>
    </div>
  );
};
