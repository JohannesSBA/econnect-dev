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
import ManageConnections from "../components/visualComponents/ManageConnections";

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
    const recentApplications = applications
        ?.sort(
            (
                a: { createdAt: string | number | Date },
                b: { createdAt: string | number | Date }
            ) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 2);

    return (
        <div className="flex min-h-full flex-col bg-slate-100">
            <div className="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-10 sm:px-6 lg:px-8">
                <aside className="md:sticky top-4  w-full md:w-auto md:mb-4 shrink-0 xl:flex border-r md:max-h-full">
                    <ManageConnections
                        connectionsLength={connections.length}
                        pendingFriendRequests={
                            user.pendingFriendRequest?.length as number
                        }
                    />
                </aside>

                <main className="flex-1  w-2/3 flex-col shadow-md p-2 max-w-full">
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
                    <SideInfo
                        user={user}
                        posts={posts}
                        applications={applications}
                    />
                </aside>
            </div>
        </div>
    );
};

export default Page;
