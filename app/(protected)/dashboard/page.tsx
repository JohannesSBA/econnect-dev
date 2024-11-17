import React, { useState } from "react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { redirect, useRouter } from "next/navigation";
import NewPost from "../components/functionComponents/NewPost";
import { User } from "@nextui-org/react";
import { FiAirplay, FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import SideInfo from "../components/visualComponents/SideInfo";
import Posts from "../components/visualComponents/Posts";
import RecentApps from "../components/visualComponents/RecentApps";

const Page = async () => {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    return redirect("/auth/signin"); // handle unauthenticated state
  }

  const user = await getUserContent(session.user.id);

  if (!user) return null; // handle case where user is null

  if (user.role === "EMPLOYER") {
    redirect("/employer-dashboard");
  } else if (user.gotStarted === false && user.role === "EMPLOYEE") {
    redirect("/get-started");
  }

  const connections = user.friends ?? [];
  const posts = user.posts;
  const applications = user.applicant;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-scroll bg-white">
      <div className="flex w-full mx-auto md:mx-0 items-start gap-x-8 pr-4  sm:pr-6 lg:pr-8">
        <aside className="sticky top-4 hidden shrink-0 xl:flex border-r max-h-full">
          <RecentApps user={session.user.id} applicants={applications ?? []} />
        </aside>
        <main className="flex-1 flex-col shadow-md p-2 max-w-full">
          <div className="flex pt-2 justify-between w-full">
            <div className="flex">
              <User
                name={""} // Add the 'name' property with a value
                avatarProps={{
                  isBordered: true,
                  src: `https://econnectbucket.s3.amazonaws.com/image/${user.id}`,
                }}
                className="transition-transform ml-4 translate-x-4"
              />
              <NewPost />
            </div>
            <h1 className="font-semibold w-full text-end p-2  text-2xl text-slate-900 hidden md:flex">
              Your Activity
            </h1>
          </div>
          <Link
            href="/dashboard/my-posts"
            className="text-blue-400 font-light text-center"
          >
            Your Posts
          </Link>
          <div className="h-full bg-white rounded-md text-black">
            <Posts
              id={session.user.id}
              userId={session.user.id}
              fromPage={"default"}
            />
          </div>
        </main>

        <aside className="sticky top-8 hidden w-96 shrink-0 xl:flex">
          <SideInfo user={user} posts={posts} applications={applications} />
        </aside>
      </div>
    </div>
  );
};

export default Page;
