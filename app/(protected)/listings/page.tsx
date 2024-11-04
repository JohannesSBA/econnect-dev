import React from "react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { redirect, usePathname } from "next/navigation";
import JobListing from "../components/visualComponents/JobListing";
import NewPost from "../components/functionComponents/NewPost";
import { Button, User, Image } from "@nextui-org/react";
import { FiAirplay, FiExternalLink } from "react-icons/fi";
import { MdGroups } from "react-icons/md";
import Link from "next/link";
import SideInfo from "../components/visualComponents/SideInfo";

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
  const applications = user.jobApplications;
  const recentApplications = applications
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 2);

  return (
    <div className="flex min-h-full flex-col bg-slate-100">
      <div className="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-10 sm:px-6 lg:px-8">
        <aside className="sticky top-8 hidden w-44 shrink-0 lg:flex shadow-md p-2">
          {/* Left column area */}
          <div className="text-2xl text-slate-800 font-semibold">
            Recent Applications
            <div className="h-[600px] w-full flex flex-col gap-2">
              {recentApplications?.length === 0 && (
                <div className="text-sm font-semibold text-slate-400">
                  No recent applications
                </div>
              )}
              {recentApplications?.map(
                (application: {
                  id: React.Key | null | undefined;
                  postedById: any;
                  title:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | React.PromiseLikeOfReactNode
                    | null
                    | undefined;
                  description:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | React.PromiseLikeOfReactNode
                    | null
                    | undefined;
                }) => (
                  <div
                    key={application.id}
                    className="flex items-center gap-4 shadow-md rounded-md"
                  >
                    <div className="flex p-6 gap-2">
                      <Image
                        width={50}
                        height={50}
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
                )
              )}
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
        </aside>

        <main className="flex-1 flex-col shadow-md p-2 max-w-full">
          <div className="flex pt-2">
            <h1 className="font-semibold w-full text-end p-2 pr-4 text-2xl text-slate-900 hidden md:flex">
              Job Listings
            </h1>
          </div>

          <div className="h-full bg-white rounded-md text-black overflow-scroll">
            <JobListing />
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
