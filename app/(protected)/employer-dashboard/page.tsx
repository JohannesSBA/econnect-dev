import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import {
  FaArchive,
  FaBriefcase,
  FaEnvelope,
  FaUser,
  FaMousePointer,
} from "react-icons/fa";
import Link from "next/link";
import { MdSpaceDashboard } from "react-icons/md";
import JobListing from "../components/visualComponents/JobListing";
import { getListing } from "@/app/helpers/getListing";
import { Jobs } from "@/app/types/db";
import { IoIosAdd } from "react-icons/io";

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
        TotalApplicants += listing.applicant.length;
      }
    }
  }

  const nonExpiredJobs = (user?.jobListingsPosted ?? []).filter(
    (job: { Expired: any }) => !job.Expired
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Welcome, {user.firstName}
          </h1>
          <p className="mt-2 text-gray-600">Manage your job listings and applicants</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <Link
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 shadow-lg transition-transform hover:scale-[1.02] hover:shadow-xl group"
            href={`/employer-dashboard/jobs_active`}
          >
            <div className="flex items-center">
              <span className="flex-shrink-0 rounded-full h-12 w-12 bg-white/20 text-white flex items-center justify-center mr-4 transition-colors group-hover:bg-white group-hover:text-blue-600">
                <FaBriefcase className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold text-white text-lg">Active Listings</h2>
                <p className="text-blue-100 text-sm mt-1">Manage current job postings</p>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 opacity-10 transform translate-x-4 translate-y-4">
              <FaBriefcase className="h-24 w-24" />
            </div>
          </Link>
          
          <Link
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 shadow-lg transition-transform hover:scale-[1.02] hover:shadow-xl group"
            href={"/employer-dashboard/archived"}
          >
            <div className="flex items-center">
              <span className="flex-shrink-0 rounded-full h-12 w-12 bg-white/20 text-white flex items-center justify-center mr-4 transition-colors group-hover:bg-white group-hover:text-indigo-600">
                <FaArchive className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold text-white text-lg">Archived Jobs</h2>
                <p className="text-indigo-100 text-sm mt-1">View past job listings</p>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 opacity-10 transform translate-x-4 translate-y-4">
              <FaArchive className="h-24 w-24" />
            </div>
          </Link>
          
          <Link
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 shadow-lg transition-transform hover:scale-[1.02] hover:shadow-xl group"
            href={"/employer-dashboard/newListing"}
          >
            <div className="flex items-center">
              <span className="flex-shrink-0 rounded-full h-12 w-12 bg-white/20 text-white flex items-center justify-center mr-4 transition-colors group-hover:bg-white group-hover:text-emerald-600">
                <IoIosAdd className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-semibold text-white text-lg">New Listing</h2>
                <p className="text-emerald-100 text-sm mt-1">Create a job posting</p>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 opacity-10 transform translate-x-4 translate-y-4">
              <IoIosAdd className="h-24 w-24" />
            </div>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
          </div>
          
          <div className="p-6">
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-lg bg-white border border-gray-100 px-6 py-5 shadow-sm hover:shadow transition duration-300"
                >
                  <dt className="flex items-center">
                    <div className="flex-shrink-0 rounded-md bg-indigo-600 p-3 shadow-sm">
                      <item.icon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="ml-4 truncate text-sm font-medium text-gray-600">
                      {item.name}
                    </p>
                  </dt>
                  <dd className="mt-4">
                    <p className="text-3xl font-semibold text-gray-900">{item.stat}</p>
                    
                    <div className="mt-4">
                      <Link
                        href="#"
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View details
                        <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </dd>
                </div>
              ))}
            </dl>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
