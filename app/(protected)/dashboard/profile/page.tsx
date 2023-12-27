import React from "react";
import UserAbout from "../../components/UserAbout";
import EditContent from "../../components/EditContent";
import { getUserContent } from "@/app/helpers/getUser";
import { Card, Image } from "@nextui-org/react";
import ProfileImage from "../../components/ProfileImage";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import UserEducation from "../../components/UserEducation";

const page = async () => {
  const session = await getServerSession(options);
  const userInfo = await getUserContent(session?.user.id as string);

  return (
    <div className="w-screen h-screen bg-white flex">
      <div className="w-1/3 h-full ">
        <div className="h-2/5 w-full  flex flex-col justify-center items-center">
          <ProfileImage image={userInfo.image as string} />
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

// <div className="h-fit md:h-screen bg-slate-50">
//   <div className="w-screen flex overflow-auto flex-col md:flex-row gap-2">
//     <div className="w-full flex flex-col items-center bg-slate-50 pt-4 gap-2">
//       {/* User Card */}
//       <div className=" border-2 border-slate-200 rounded-md shadow-sm flex justify-center">
//         <Card className="bg-transparent ml-6 p-2 flex justify-center w-4/6">
//           <div className="">
//             <ProfileImage image={userInfo.image as string} />
//           </div>
//           <div className="ml-4 p-2">
//             <h1 className="font-bold text-2xl text-black ">
//               {userInfo.fullName}
//             </h1>
//             <h2 className="text-slate-600 text-sm">
//               ({userInfo.pronouns})
//             </h2>
//             <h2 className="text-slate-600 text-sm">
//               {userInfo.currentPosition}
//             </h2>
//             <h2 className="text-slate-600 text-sm pt-2">
//               {userInfo.location}
//             </h2>
//           </div>
//         </Card>
//       </div>
//       {/* User About */}
//       <UserAbout userBio={userInfo.bio as string} />
//       {/* Edit Content */}
//       <EditContent
//         userBio={userInfo.bio as string}
//         userName={userInfo.firstName as string}
//         userPronouns={userInfo.pronouns}
//         userLocation={userInfo.location as string}
//         userEducation={userInfo.education}
//         userCPosition={userInfo.currentPosition as string}
//         userTitle={userInfo.title as string}
//       />
//       {/* <UserExperience /> */}
//       <div className="w-80 md:w-screen border-2 border-slate-200 rounded-md shadow-sm flex justify-center">
//         <Card className="bg-transparent ml-6 p-2 flex justify-center w-4/6">
//           <div className="ml-4 p-2">
//             <h1 className="font-bold text-2xl text-black ">Experience</h1>
//             <h2 className="text-slate-600 text-sm">(He/Him)</h2>
//             <h2 className="text-slate-600 text-sm">
//               Student at Fordham University
//             </h2>
//             <h2 className="text-slate-600 text-sm pt-2">
//               Addis Ababa, Ethiopia
//             </h2>
//           </div>
//         </Card>
//       </div>
//     </div>
//   </div>
// </div>
