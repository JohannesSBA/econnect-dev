import React from "react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { redirect } from "next/navigation";
import NewPost from "../components/functionComponents/NewPost";
import { Button, Divider, User } from "@nextui-org/react";
import Link from "next/link";
import SideInfo from "../components/visualComponents/SideInfo";
import { FaArrowRight } from "react-icons/fa";
import Posts from "../components/visualComponents/Posts/Posts";
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
    const pendingFriendRequest = user.pendingFriendRequest || [];
    const posts = user.posts;
    const applications = user.applicant;

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col overflow-scroll bg-gradient-to-br from-white to-blue-100 ">
            <div className="flex w-full mx-auto flex-col  md:flex-row md:mx-0 items-start gap-x-8 pr-4  sm:pr-6 lg:pr-8">
                <aside className="md:sticky top-4  w-full md:w-auto md:mb-4 shrink-0 xl:flex border-r md:max-h-full">
                    <ManageConnections
                        connectionsLength={connections.length}
                        pendingFriendRequests={pendingFriendRequest.length}
                    />
                </aside>
                <main className="flex-1 flex-col p-2 max-w-full">
                    <div className="flex p-2 w-full rounded-md  justify-center">
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
                    {/* <Link
                        href="/dashboard/my-posts"
                        className="text-blue-400 font-light text-center"
                    >
                        Your Posts
                    </Link> */}
                    <div className="h-full flex flex-col items-center rounded-md text-black">
                        <Posts
                            userId={session.user.id}
                            currentUserName={
                                user.firstName + " " + user.lastName
                            }
                            fromPage={"default"}
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
