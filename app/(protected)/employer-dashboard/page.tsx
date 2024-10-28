import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { CgProfile } from "react-icons/cg";
import NewJobListing from "../components/NewJobListing";
import Image from "next/image";
import {
    FaArchive,
    FaBriefcase,
    FaEnvelope,
    FaUser,
    FaMousePointer,
} from "react-icons/fa";
import Link from "next/link";
import { MdSpaceDashboard } from "react-icons/md";
import JobListing from "../components/JobListing";
import { getListing } from "@/app/helpers/getListing";
import { Jobs } from "@/app/types/db";

const Page = async () => {
    const session = await getServerSession(options);
    if (!session) {
        return;
    }

    function classNames(...classes: any[]) {
        return classes.filter(Boolean).join(" ");
    }

    const user = await getUserContent(session.user.id);

    if (user.role === "EMPLOYEE") redirect("/dashboard");

    let TotalApplicants = 0;
    if (user.jobListingsPosted && user.jobListingsPosted.length > 0) {
        for (const job of user.jobListingsPosted) {
            const listing = await getListing(job.id);
            if (listing) {
                TotalApplicants += listing.applicants.length;
            }
        }
    }

    const nonExpiredJobs = (user?.jobListingsPosted ?? []).filter(
        (job) => !job.Expired
    );

    const stats = [
        {
            id: 1,
            name: "Total Jobs posted",
            stat: user?.jobListingsPosted?.length ?? 0,
            icon: FaMousePointer,
        },
        {
            id: 2,
            name: "Total Active Listings",
            stat: nonExpiredJobs.length,
            icon: FaEnvelope,
        },
        {
            id: 3,
            name: "Total applicants across all jobs",
            stat: TotalApplicants,
            icon: FaUser,
            change: "3.2%",
            changeType: "decrease",
        },
    ];

    return (
        <div className="bg-slate-100 w-screen h-[calc(100vh-5rem)] flex justify-center">
            <div className="hidden md:flex border-r-1 shadow-md w-1/6 h-full flex-col justify-between">
                <div className="text-slate-800 bg-red-40 mx-auto mt-12"></div>
                <div className="flex flex-col text-slate-400 text-sm">
                    <a href="">Privacy</a>
                    <a href="">Terms</a>
                    <a href="">Accessability</a>
                </div>
            </div>
            <div className="bg-slate-100 w-full md:w-5/6 h-full flex flex-col p-8 gap-8">
                <div className=" text-slate-800 text-2xl md:text-6xl font-bold ">
                    Welcome, {user.firstName}
                </div>
                <div className="flex flex-col md:flex-row md:justify-evenly">
                    <Link
                        className="rounded-lg bg-blue-600 p-8 m-2 w-1/2 h-32 shadow-md flex items-center text-slate-100 group"
                        href={`/employer-dashboard/jobs_active`}
                    >
                        <span className="rounded-full h-12 w-12 group-hover:bg-white text-white group-hover:text-black flex items-center justify-center mx-3">
                            <FaBriefcase />
                        </span>
                        Active Listings
                    </Link>
                    <Link
                        className="rounded-lg bg-blue-400 p-8 m-2 w-1/2 h-32 shadow-md flex items-center text-slate-100 group"
                        href={"/employer-dashboard/archived"}
                    >
                        <span className="rounded-full h-12 w-12 bg-blue-400 group-hover:bg-white text-white group-hover:text-black flex items-center justify-center mx-3">
                            <FaArchive />
                        </span>
                        Archived Jobs
                    </Link>
                    <NewJobListing id={session?.user.id} />
                </div>
                <div className=" rounded-md w-full h-full shadow-md flex flex-col">
                    <h1 className="w-full h-12 p-4 border-b-2 shadow-md text-slate-900 font-semibold">
                        Facts & Figures
                    </h1>
                    <div className="w-full p-4 text-slate-900">
                        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {stats.map((item) => (
                                <div
                                    key={item.id}
                                    className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
                                >
                                    <dt>
                                        <div className="absolute rounded-md bg-indigo-500 p-3">
                                            <item.icon
                                                aria-hidden="true"
                                                className="h-6 w-6 text-white"
                                            />
                                        </div>
                                        <p className="ml-16 truncate text-sm font-medium text-gray-500">
                                            {item.name}
                                        </p>
                                    </dt>
                                    <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {item.stat}
                                        </p>

                                        <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                                            <div className="text-sm">
                                                <a
                                                    href="#"
                                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                                >
                                                    View all
                                                    <span className="sr-only">
                                                        {" "}
                                                        {item.name} stats
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
