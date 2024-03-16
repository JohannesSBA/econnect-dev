import React from "react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { redirect, usePathname } from "next/navigation";
import JobListing from "../components/JobListing";
import NewPost from "../components/NewPost";
import { User } from "@nextui-org/react";
import { FiAirplay, FiExternalLink } from "react-icons/fi";
import Posts from "../components/Posts";

const page = async () => {
  const session = await getServerSession(options);
  const user = await getUserContent(session?.user.id as string);

  if (user.role === "EMPLOYER") redirect("/employer-dashboard");
  if (user.gotStarted == false) redirect("/get-started");

  return (
    <div className="w-screen h-screen bg-slate-100 flex gap-12 justify-center font-PlusJakartSans">
      <div className="w-1/4 flex flex-col">
        <h1 className="text-2xl text-slate-800 m-8 font-semibold">
          Recent Applications
          <div className="h-[600px] w-full bg-blue-400"></div>
          <div>
            <a className="flex gap-3" href="/">
              <FiExternalLink />
              <h2 className="text-sm">All Applications</h2>
            </a>
            <a className="flex gap-3" href="/">
              <FiAirplay />
              <h2 className="text-sm">Explore</h2>
            </a>
          </div>
        </h1>
      </div>
      <div className="w-3/4 flex flex-col m-4 border rounded-md">
        <h1 className=" font-semibold w-full text-end p-2 pr-4 text-2xl text-slate-900">
          Posts
        </h1>
        <div className="h-[553px] bg-slate-100 rounded-md m-4">
          <Posts id={session?.user.id as string} />
        </div>
        <div className="bg-slate-100 rounded-md mx-2 flex">
          <User
            as="image"
            avatarProps={{
              isBordered: true,
              src: `https://econnectbucket.s3.amazonaws.com/image/${user.id}`,
            }}
            className="transition-transform ml-4 translate-x-4"
            name=""
          />
          <NewPost />
          <a href="dashboard/my-posts" className="text-blue-400 font-light">
            Your Posts
          </a>
        </div>
      </div>
    </div>
  );
};

export default page;
