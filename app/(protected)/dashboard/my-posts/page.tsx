import React, { useState } from "react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { redirect, useRouter } from "next/navigation";
import { Button, Divider, User } from "@nextui-org/react";
import { FiAirplay, FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import NewPost from "../../components/functionComponents/NewPost";
import Posts from "../../components/visualComponents/Posts";
import SideInfo from "../../components/visualComponents/SideInfo";

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
    const pendingFriendRequest = user.pendingFriendRequest || [];
    const posts = user.posts;
    const applications = user.applicant;

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col overflow-scroll bg-gradient-to-br from-white to-blue-100 ">
            <div className="flex w-full mx-auto flex-col  md:flex-row md:mx-0 items-start gap-x-8 pr-4  sm:pr-6 lg:pr-8">
                <aside className="md:sticky top-4  w-full md:w-auto mb-4 shrink-0 xl:flex border-r max-h-full">
                    <div className="overflow-hidden rounded-lg bg-white shadow-md p-2">
                        <div className="px-4 py-5 sm:p-6 flex flex-col w-full">
                            <h1 className="pb-2">Manage Connections</h1>
                            <Divider className="my-4" />
                            <Button
                                as={Link}
                                href="/dashboard/connections"
                                radius="none"
                                variant="light"
                                className="group w-full flex justify-between"
                            >
                                <p>Connections</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-slate-400 group-hover:text-black">
                                        {connections.length}
                                    </p>
                                    <FaArrowRight className="text-slate-400 group-hover:text-black" />
                                </div>
                            </Button>
                            <Button
                                as={Link}
                                href="/dashboard/connections#findPeople"
                                radius="none"
                                variant="light"
                                className="group w-full flex justify-between"
                            >
                                <p>Grow Network</p>
                                <FaArrowRight className="text-slate-400 group-hover:text-black" />
                            </Button>
                            <Button
                                as={Link}
                                href="/chat/friend-requests"
                                radius="none"
                                variant="light"
                                className="group w-60 flex justify-between"
                            >
                                <p>Pending Requests</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-slate-400 group-hover:text-black">
                                        {pendingFriendRequest.length}
                                    </p>
                                    <FaArrowRight className="text-slate-400 group-hover:text-black" />
                                </div>
                            </Button>
                        </div>
                    </div>
                </aside>
                <main className="flex-1 flex-col p-2 max-w-full">
                    <div className="flex p-2 w-full rounded-md border bg-white">
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
                    <Link
                        href="/dashboard"
                        className="text-blue-400 font-light text-center"
                    >
                        Home
                    </Link>
                    <div className="h-full bg-white rounded-md text-black">
                        <Posts userId={session.user.id} fromPage={"my"} />
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
