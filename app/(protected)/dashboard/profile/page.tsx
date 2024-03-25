import React from "react";
import UserAbout from "../../components/UserAbout";
import EditContent from "../../components/EditContent";
import { getUserContent } from "@/app/helpers/getUser";
import { Button, Card, Image } from "@nextui-org/react";
import ProfileImage from "../../components/ProfileImage";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import UserEducation from "../../components/UserEducation";
import { redirect } from "next/navigation";
import UploadResume from "../../components/UploadResume";
import { FiExternalLink, FiMessageSquare, FiUserPlus } from "react-icons/fi";
import Posts from "../../components/Posts";
import { educationProps } from "@/app/types/db";

const page = async () => {
  const session = await getServerSession(options);
  const userInfo = await getUserContent(session?.user.id as string);
  const pageName = "profile";

  if (userInfo.role === "EMPLOYER") {
    redirect("/employer-dashboard/profile");
  }

  const numOfConnection =
    (userInfo.friends?.length ?? 0) + (userInfo.friendsOf?.length ?? 0);

  const dateJoined = userInfo.emailVerified;

  return (
    <div className="w-screen h-[calc(100vh-5rem)] flex bg-slate-100">
      <EditContent
        userBio={userInfo.bio as string}
        userName={userInfo.firstName as string}
        userPronouns={userInfo.pronouns}
        userLocation={userInfo.location as string}
        userEducation={(userInfo.education ?? []).map((edu) => ({
          ...edu,
          GPA: edu.GPA || 0,
          major: edu.major || "", // Ensure major is not nullable
          education: edu.degree || "",
        }))}
        userCPosition={userInfo.currentPosition as string}
        userTitle={userInfo.title as string}
      />
      <div className="w-1/3 h-full flex flex-col px-8 gap-12">
        <div className="w-full flex flex-col justify-center items-center gap-3">
          <ProfileImage />
          <h1 className="text-2xl font-semibold text-slate-900">
            {userInfo.fullName}
          </h1>
          <h2 className="text-[#4773C5] text-lg">{userInfo.title}</h2>
          <p className="text-slate-600 text-sm line-clamp-5">{userInfo.bio}</p>
        </div>
        {pageName !== "profile" ? (
          <div className="w-full flex justify-evenly">
            <Button className="w-36 border-[#A39999]" variant="bordered">
              {" "}
              <FiUserPlus /> Connect
            </Button>
            <Button className="w-36 border-[#A39999]" variant="bordered">
              {" "}
              <FiMessageSquare /> Chat
            </Button>
            <Button className="w-36 border-[#A39999]" variant="bordered">
              {" "}
              <FiExternalLink /> Share
            </Button>
          </div>
        ) : (
          ""
        )}
        <div className="w-full flex flex-col justify-around gap-8">
          <div className="flex flex-col w-full">
            <div className="flex justify-between ">
              <h1 className="text-[#727171]">Connections</h1>
              <h1 className="text-black">{numOfConnection}</h1>
            </div>
            <div className="flex justify-between ">
              <h1 className="text-[#727171]">Gender</h1>
              <h1 className="text-black">{userInfo.pronouns}</h1>
            </div>
            <div className="flex justify-between ">
              <h1 className="text-[#727171]">Languages</h1>
              <h1 className="text-black">{userInfo.pronouns}</h1>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex justify-between ">
              <h1 className="text-[#727171]">Location</h1>
              <h1 className="text-black">{userInfo.location}</h1>
            </div>
            <div className="flex justify-between ">
              <h1 className="text-[#727171]">Joined</h1>
              <h1 className="text-black">
                {dateJoined ? new Date(dateJoined).toLocaleDateString() : "N/A"}
              </h1>
            </div>
            <div className="flex justify-between ">
              <h1 className="text-[#727171]">Connections</h1>
              <h1 className="text-black">Employed</h1>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div className="w-1/3 h-full p-8">
        <div className="w-full h-1/2 flex flex-col">
          <h1 className="text-[#4773C5] text-2xl text-end">Education</h1>
          <div className="m-2 p-8 h-full w-full rounded-3xl">
            <ul>
              <li>
                <h1>Fordham University</h1>
                <p className="ml-2">Bachelors Degree</p>
                <p className="ml-2">GPA: 3.8</p>
              </li>
              <li>
                <h1>Intercnational Community Schoole</h1>
                <p className="ml-2">High School</p>
                <p className="ml-2">GPA: 3.8</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full h-1/2">
          <h1 className="text-[#4773C5] text-2xl text-end">Posts</h1>
          <div className="m-2 p-8 w-full h-72 rounded-3xl">
            <Posts id={userInfo?.id as string} />
          </div>
        </div>
      </div>
      <div className="w-1/3 h-full p-8">
        <div className="w-full h-full flex flex-col">
          <h1 className="text-[#4773C5] text-2xl text-end">Experience</h1>
          <div className="m-2 p-8 h-full w-full rounded-3xl flex flex-col justify-between">
            <div></div>
            <div className="flex items-end flex-col">
              <UploadResume />
              <a
                href={`https://econnectbucket.s3.amazonaws.com/resume/${userInfo.id}`}
                target="_blank"
                className="mr-4 cursor-pointer text-[#4773C5] text-sm font-semibold"
              >
                View Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

{
  /* <div className="h-1/4 w-full flex ml-12 mt-12 border-b-2 pb-6 justify-between">
        <div className="flex gap-4">
          <ProfileImage image={userInfo.image as string} />
          <h1 className="font-bold text-2xl text-black h-full flex flex-col justify-center capitalize">
            {userInfo.fullName}
            <span className="text-sm font-extralight text-slate-600 ml-2 flex flex-col normal-case">
              <p>{userInfo.email}</p>
              <p>{userInfo.pronouns}</p>
              <p>{userInfo.location}</p>
            </span>
          </h1>
        </div>
        <div className="flex flex-col justify-center items-center mr-16">
          <EditContent
            userBio={userInfo.bio as string}
            userName={userInfo.firstName as string}
            userPronouns={userInfo.pronouns}
            userLocation={userInfo.location as string}
            userEducation={userInfo.education}
            userCPosition={userInfo.currentPosition as string}
            userTitle={userInfo.title as string}
          />

          <UploadResume />
        </div>
      </div>
      <div className="h-full w-full flex px-6">
        <div className="w-1/3 h-full flex-1">
          <UserAbout userBio={userInfo.bio as string} />
          <UserEducation userInfo={userInfo} />
        </div>
        <div className="w-1/3 h-full flex-1">
          <UserEducation userInfo={userInfo} />
        </div>
        <div className="w-1/3 h-full flex-1 p-8">
          <object
            data={`https://econnectbucket.s3.amazonaws.com/resume/${userInfo.id}`}
            type="application/pdf"
            width="100%"
            height="100%"
          ></object>
        </div>
      </div> */
}
