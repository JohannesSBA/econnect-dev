import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { CgProfile } from "react-icons/cg";
import NewJobListing from "../components/NewJobListing";
import Image from "next/image";
import { FaArchive, FaBriefcase, FaNewspaper } from "react-icons/fa";
import Link from "next/link";
import { MdSpaceDashboard } from "react-icons/md";

const Page = async () => {
  const session = await getServerSession(options);
  if (!session) {
    return;
  }

  const user = await getUserContent(session.user.id);

  if (user.role === "EMPLOYEE") redirect("/dashboard");

  return (
    <div className="bg-slate-100 w-screen h-[calc(100vh-5rem)] flex justify-center">
      <div className="hidden md:flex border-r-1 shadow-md w-1/4 h-full flex-col justify-between p-2">
        <div className="text-slate-800 bg-red-40 mx-auto mt-12"></div>
        <div className="flex flex-col text-slate-400 text-sm">
          <a href="">Privacy</a>
          <a href="">Terms</a>
          <a href="">Accessability</a>
        </div>
      </div>
      <div className="bg-slate-100 w-full md:w-3/4 h-full flex flex-col p-8 gap-8">
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
        </div>
        <div className=" rounded-md w-full h-full shadow-md flex flex-col">
          <h1 className="w-full h-12 p-4 border-b-2 shadow-md text-slate-900 font-semibold">
            Recent Applicants
          </h1>
          <div className="w-full p-4 text-slate-900">
            <div className="flex flex-col gap-12 w-full rounded-sm shadow-sm">
              <div className="flex gap-2 p-2">
                <Image
                  src="/user-avatar.png"
                  alt="user pic"
                  width={50}
                  height={50}
                />
                <div className="flex flex-col">
                  <h1>Johannes Bekele</h1>
                  <div className="flex gap-2">
                    <p>Development</p>
                    <p>30,0000</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 p-2">
                <Image
                  src="/user-avatar.png"
                  alt="user pic"
                  width={50}
                  height={50}
                />
                <div className="flex flex-col">
                  <h1>Johannes Bekele</h1>
                  <div className="flex gap-2">
                    <p>Development</p>
                    <p>30,0000</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 p-2">
                <Image
                  src="/user-avatar.png"
                  alt="user pic"
                  width={50}
                  height={50}
                />
                <div className="flex flex-col">
                  <h1>Johannes Bekele</h1>
                  <div className="flex gap-2">
                    <p>Development</p>
                    <p>30,0000</p>
                  </div>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
