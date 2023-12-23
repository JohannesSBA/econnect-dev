import React from "react";
import UserAbout from "../../components/UserAbout";
import EditContent from "../../components/EditContent";
import { getUserContent } from "@/app/helpers/getUser";
import { Card, Image } from "@nextui-org/react";

const page = async () => {
  const userInfo = await getUserContent("");

  return (
    <div className="h-fit md:h-screen bg-slate-200">
      <div className="w-screen flex overflow-auto flex-col md:flex-row gap-2">
        <div className="w-full flex flex-col items-center bg-slate-200 pt-4 gap-2">
          {/* User Card */}
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
                <h2 className="text-slate-600 text-sm">
                  ({userInfo.pronouns})
                </h2>
                <h2 className="text-slate-600 text-sm">
                  {userInfo.currentPosition}
                </h2>
                <h2 className="text-slate-600 text-sm pt-2">
                  {userInfo.location}
                </h2>
              </div>
            </Card>
          </div>
          {/* User About */}
          <UserAbout userBio={userInfo.bio as string} />
          {/* Edit Content */}
          <EditContent
            userBio={userInfo.bio as string}
            userName={userInfo.firstName as string}
            userPronouns={userInfo.pronouns}
            userLocation={userInfo.location as string}
            userEducation={userInfo.education}
            userCPosition={userInfo.currentPosition as string}
            userTitle={userInfo.title as string}
          />
          {/* <UserExperience /> */}
          <div className="w-80 md:w-screen border-2 border-slate-200 rounded-md shadow-sm flex justify-center">
            <Card className="bg-transparent ml-6 p-2 flex justify-center w-4/6">
              <div className="ml-4 p-2">
                <h1 className="font-bold text-2xl text-black ">Experience</h1>
                <h2 className="text-slate-600 text-sm">(He/Him)</h2>
                <h2 className="text-slate-600 text-sm">
                  Student at Fordham University
                </h2>
                <h2 className="text-slate-600 text-sm pt-2">
                  Addis Ababa, Ethiopia
                </h2>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
