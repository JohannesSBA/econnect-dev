import React from "react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import UserAbout from "../../components/UserAbout";
import Navbar from "@/app/components/Navbar";
import UserCard from "../../components/UserCard";
import { PrismaClient } from "@prisma/client";
import prisma from "@/app/lib/prisma";
import UserExperience from "../../components/UserExperience";
import Header from "@/app/components/Navbar";

export const getUserBio = async () => {
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
    };
  } catch (error) {
    // Handle the error, log it, or return a meaningful error response.
    console.error("Error in getUserBio1:", error);
    return { error: "Unable to retrieve user bio" };
  }
};
const page = async () => {
  const userInfo = await getUserBio();

  return (
    <div className="h-fit md:h-screen bg-slate-200">
      <Header />
      <div className="w-screen flex overflow-auto flex-col md:flex-row gap-2">
        <div className="w-full md:w-1/2 flex flex-col items-center bg-slate-200 pt-4 gap-2">
          <UserCard />
          <UserAbout userBio={userInfo.bio as string} />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center bg-slate-200 gap-2">
          <UserExperience />
        </div>
      </div>
    </div>
  );
};

export default page;
