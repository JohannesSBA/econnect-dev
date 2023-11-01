import React from "react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import UserCard from "@/app/components/UserCard";
import UserAbout from "@/app/components/UserAbout";
import Navbar from "@/app/components/Navbar";
import UserExperience from "@/app/components/UserExperience";

const page = async () => {
  const session = await getServerSession(options);

  return (
    <div className="h-fit md:h-screen bg-slate-200">
      <Navbar />
      <div className="w-screen flex overflow-auto flex-col md:flex-row gap-2">
        <div className="w-full md:w-1/2 flex flex-col items-center bg-slate-200 pt-4 gap-2">
          <UserCard />
          <UserAbout />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center bg-slate-200 gap-2">
          <UserExperience />
        </div>
      </div>
    </div>
  );
};

export default page;
