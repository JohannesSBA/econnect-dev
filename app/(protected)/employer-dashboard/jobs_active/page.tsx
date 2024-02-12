"use client";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Jobs } from "@/app/types/db";
import axios from "axios";
import { Session, getServerSession } from "next-auth";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const Page = () => {
  const [jobs, setJobs] = useState<Jobs[]>();

  useEffect(() => {
    const getJobs = async () => {
      try {
        const res = await axios.post("/api/job/get/business");
        console.log(res.data);
        setJobs(res.data);
      } catch {
        return toast.error("Sorry, something went wrong.");
      }
    };
    getJobs();
  }, []);

  console.log(jobs?.[0]);

  return (
    <div className="flex w-screen h-[calc(100vh-5rem)] bg-slate-100">
      <div className="h-full w-full p-6">
        <div className="w-full h-full rounded-lg border-2 border-slate-200 shadow-md">
          <h1 className="font-semibold text-xl p-4 border-b-2 text-slate-800">
            Active Job Listings
          </h1>
          {jobs?.map((job) => (
            <div key={job.id}>
              <p>{job.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
