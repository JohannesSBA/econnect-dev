import React, { useState } from "react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { redirect, useRouter } from "next/navigation";
import { User } from "@nextui-org/react";
import { FiAirplay, FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import NewPost from "../../components/functionComponents/NewPost";
import Posts from "../../components/visualComponents/Posts/Posts";
import SideInfo from "../../components/visualComponents/SideInfo";

const Page = async () => {
    const session = await getServerSession(options);
    if (!session || !session.user) {
        return redirect("/auth/signin"); // handle unauthenticated state
    }

    const user = await getUserContent(session.user.id);

    if (!user) return null; // handle case where user is null

    if (user.role === "EMPLOYEE") {
        redirect("/dashboard");
    } else if (user.gotStarted === false && user.role === "EMPLOYEE") {
        redirect("/get-started");
    }

    const connections = user.friends ?? [];
    const posts = user.posts;
    const applications = user.applicant;

    return (
        <div className="flex h-[calc(100vh-4rem)] min-h-screen flex-col overflow-y-auto bg-gradient-to-br from-white to-blue-100">
            <div className="flex w-full max-w-screen-xl mx-auto items-start gap-x-8 px-4 sm:px-6 lg:px-8">
                <main className="flex-1 flex-col p-4 max-w-full">
                    <div className="flex pt-2 justify-between w-full border-b pb-4 mb-4">
                        <div className="flex items-center">
                            <User
                                name={`${user.firstName} ${user.lastName}`}
                                avatarProps={{
                                    isBordered: true,
                                    src: `https://econnectbucket.s3.amazonaws.com/image/${user.id}`,
                                }}
                                className="transition-transform"
                            />
                            <NewPost />
                        </div>
                        <h1 className="font-semibold text-end p-2 text-2xl text-slate-900 hidden md:block">
                            Your Activity
                        </h1>
                    </div>
                    <Link
                        href="/dashboard/my-posts"
                        className="text-blue-500 hover:text-blue-700 font-medium text-sm flex items-center justify-center mb-4"
                    >
                        <span>View Your Posts</span>
                        <FiExternalLink className="ml-1" size={14} />
                    </Link>
                    <div className=" rounded-lg shadow-sm p-4 text-black">
                        <Posts
                            userId={session.user.id}
                            fromPage={"default"}
                            currentUserName={
                                user.firstName + " " + user.lastName
                            }
                        />
                    </div>
                </main>

                <aside className="sticky top-8 hidden w-96 shrink-0 xl:block">
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
