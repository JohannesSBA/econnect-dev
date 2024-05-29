import React from "react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { redirect, usePathname } from "next/navigation";
import JobListing from "../components/JobListing";
import NewPost from "../components/NewPost";
import { Button, User, Image } from "@nextui-org/react";
import { FiAirplay, FiExternalLink } from "react-icons/fi";
import Posts from "../components/Posts";
import UserPicture from "../components/UserPicture";
import { MdGroups } from "react-icons/md";
import Link from "next/link";
import SideInfo from "../components/SideInfo";

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

  const connections = (user.friends ?? []).concat(user.friendsOf ?? []);
  const posts = user.posts;
  const applications = user.jobApplications;
  const recentApplications = applications
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 2);

  return (
    <div className="w-screen h-screen overflow-clip bg-slate-100 flex justify-center font-PlusJakartSans">
      <div className="w-1/4 flex flex-col">
        <div className="text-2xl text-slate-800 m-8 font-semibold">
          Recent Applications
          <div className="h-[600px] w-full flex flex-col gap-2">
            {recentApplications?.length === 0 && (
              <div className="text-sm font-semibold text-slate-400">
                No recent applications
              </div>
            )}
            {recentApplications?.map((application) => (
              <div
                key={application.id}
                className="flex items-center gap-4 shadow-md rounded-md"
              >
                <div className="flex p-6 gap-2">
                  <Image
                    width={50}
                    className="rounded-full"
                    alt="Application Image"
                    src={`https://econnectbucket.s3.amazonaws.com/image/${application.postedById}`}
                  />
                  <h2 className="text-lg font-semibold">
                    {application.title}
                    <p className="text-sm text-light">
                      {application.description}
                    </p>
                  </h2>
                </div>
              </div>
            ))}
          </div>
          <div>
            <Link className="flex gap-3" href="/">
              <FiExternalLink />
              <h2 className="text-sm">All Applications</h2>
            </Link>
            <Link className="flex gap-3" href="/">
              <FiAirplay />
              <h2 className="text-sm">Explore</h2>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-2/4 flex flex-col h-[90%] border rounded-md">
        <h1 className="font-semibold w-full text-end p-2 pr-4 text-2xl text-slate-900">
          Posts
        </h1>
        <div className="h-[553px] bg-white rounded-md m-4 text-black overflow-scroll">
          <Posts id={session.user.id} />
        </div>
        <div className="bg-white rounded-md mx-2 flex p-2">
          <User
            name="User Name" // Add the 'name' property with a value
            avatarProps={{
              isBordered: true,
              src: `https://econnectbucket.s3.amazonaws.com/image/${user.id}`,
            }}
            className="transition-transform ml-4 translate-x-4"
          />
          <NewPost />
          <Link href="dashboard/my-posts" className="text-blue-400 font-light">
            Your Posts
          </Link>
        </div>
      </div>
      <div className="w-[26.7%] h-[90%] flex flex-col m-2 p-2">
        <SideInfo user={user} posts={posts} applications={applications} />
      </div>
    </div>
  );
};

export default Page;
