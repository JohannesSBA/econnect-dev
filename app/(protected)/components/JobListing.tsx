"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { User } from "@nextui-org/react";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import { Jobs } from "@/app/types/db";

const JobListing = () => {
  // Your component logic here
  const [page, setPage] = useState(0);
  const sentinelRef = useRef(null);
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const fetchJobs = useCallback(async () => {
    try {
      const res = await axios.post("/api/job/get/all", {
        page: page,
        limit: 5,
      });
      setJobs(res.data);
    } catch {
      return toast.error("Sorry, something went wrong.");
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchJobs();
      }
    });

    const currentRef = sentinelRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchJobs]);

  return (
    <div className="flex flex-col gap-4 mt-4 p-4 w-full items-center">
      {jobs.map((job) => (
        <Link
          key={job.id}
          href={`/job/${job.id}`}
          className="w-[28rem] h-40 p-2 flex items-center bg-white overflow-clip"
        >
          <div className="flex">
            <div className="flex items-center">
              <User
                avatarProps={{
                  src: `https://econnectbucket.s3.amazonaws.com/image/${job.postedById}`,
                }}
                className="transition-transform"
                description={""}
                name={""}
              />
            </div>
            <div>
              <span className="text-blue-800 text-sm">{job.title}</span>
              <h3 className="font-bold mt-px text-black">
                {job.shortDescription}
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm">
                  {job.jobType}
                </span>
                <span className="text-slate-600 text-sm flex gap-1 items-center">
                  {" "}
                  <FaLocationDot /> {job.location}
                </span>
                <span className="text-slate-600 text-sm">{job.createdAt}</span>
              </div>
              <span className="text-slate-400 text-xs">
                Over 100 applicants
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default JobListing;
