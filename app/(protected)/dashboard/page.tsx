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

const page = async () => {
    const session = await getServerSession(options);
    const user = await getUserContent(session?.user.id as string);

    if (user.role === "EMPLOYER") redirect("/employer-dashboard");
    if (user.gotStarted == false && user.role == "EMPLOYEE")
        redirect("/get-started");

    const connections = (user.friends ?? []).concat(user.friendsOf ?? []);
    const posts = user.posts;
    const applications = user.jobApplications;
    const recentApplications = applications
        ?.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 2);

    return (
        <div className="w-screen h-screen bg-slate-100 flex justify-center font-PlusJakartSans">
            <div className="w-1/4 flex flex-col">
                <h1 className="text-2xl text-slate-800 m-8 font-semibold">
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
                                        alt="NextUI hero Image"
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
            <div className="w-2/4 flex flex-col h-[90%] border rounded-md">
                <h1 className=" font-semibold w-full text-end p-2 pr-4 text-2xl text-slate-900">
                    Posts
                </h1>
                <div className="h-[553px] bg-white rounded-md m-4 text-black">
                    <Posts id={session?.user.id as string} />
                </div>
                <div className="bg-white rounded-md mx-2 flex p-2">
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
                    <a
                        href="dashboard/my-posts"
                        className="text-blue-400 font-light"
                    >
                        Your Posts
                    </a>
                </div>
            </div>
            <div className="w-1/4 h-full flex flex-col m-2 p-2">
                <div className="h-1/3 rounded-2xl w-full bg-white flex flex-col">
                    <div className="border-b border-black p-4">
                        <UserPicture />
                    </div>
                    <div className="border-y border-slate-200 rounded-md w-full flex justify-between p-3">
                        <div className="flex text-slate-500 font-semibold text-sm gap-2">
                            <MdGroups />
                            <h2>Your Connections</h2>
                        </div>
                        <h2 className="text-blue-400">{connections.length}</h2>
                    </div>
                    <div className="border-y border-slate-200 rounded-md w-full flex justify-between p-3">
                        <div className="flex text-slate-500 font-semibold text-sm gap-2 text-center">
                            <MdGroups />
                            <h2>Your Posts</h2>
                        </div>
                        <h2 className="text-blue-400">{posts?.length ?? 0}</h2>
                    </div>
                    <div className="border-y border-slate-200 rounded-md w-full flex justify-between p-3">
                        <div className="flex text-slate-500 font-semibold text-sm gap-2">
                            <MdGroups />
                            <h2>Open Job Applications</h2>
                        </div>
                        <h2 className="text-blue-400">
                            {applications?.length ?? 0}
                        </h2>
                    </div>
                    <a
                        href="/dashboard/profile"
                        className="w-full h-full flex justify-center"
                    >
                        <Button
                            variant="light"
                            className="h-full w-full"
                            href="/profile"
                        >
                            View Your Profile
                        </Button>
                    </a>
                </div>
                <h1 className="text-xl text-slate-800 py-4 my-2">Recomended</h1>
                <div className="border roundd-full bg-slate-100 h"></div>
            </div>
        </div>
    );
};

export default page;
