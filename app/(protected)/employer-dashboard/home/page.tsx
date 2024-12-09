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
import Search from "../../components/SearchComponents/Search";

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
        <div className="flex h-full flex-col overflow-y-scroll bg-gradient-to-br from-white to-blue-100 ">
            <div className="flex w-full mx-auto md:mx-0 items-start gap-x-8 pr-4  sm:pr-6 lg:pr-8">
                <main className="flex-1 flex-col p-2 max-w-full">
                    <div className="flex pt-2 mx-auto  w-full ">
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
                        <Search />
                        <h1 className="font-semibold justify-end p-2 w-full text-2xl text-slate-900 hidden md:flex">
                            Your Activity
                        </h1>
                    </div>
                    <div className="h-full bg-white rounded-md text-black">
                        <Posts
                            userId={session.user.id}
                            fromPage={"default"}
                            currentUserName={
                                user.firstName + " " + user.lastName
                            }
                        />
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
