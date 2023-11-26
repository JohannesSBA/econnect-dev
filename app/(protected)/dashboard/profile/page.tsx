import React from "react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import UserAbout from "../../components/UserAbout";
import Navbar from "@/app/(protected)/components/Navbar";
import UserCard from "../../components/UserCard";
import { PrismaClient } from "@prisma/client";
import prisma from "@/app/lib/prisma";
import UserExperience from "../../components/UserExperience";
import Header from "@/app/(protected)/components/Navbar";

export const getUserContent = async () => {
  try {
    const session = await getServerSession(options);
    const email = session?.user.email as string;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      bio: user.bio as string,
      name: user.name as string,
      pronouns: user.pronouns as string,
      location: user.location as string,
      education: user.education as string,
      currentPosition: user.currentPosition as string,
      title: user.title as string,
    };
  } catch (error) {
    // Handle the error, log it, or return a meaningful error response.
    console.error("Error in getUserBio:", error);
    return { error: "Unable to retrieve user bio" };
  }
};
const page = async () => {
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
            userLocation={userInfo.location as string}
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

export default page;
