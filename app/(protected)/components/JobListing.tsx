"use client";
import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import Image from "next/image";
import { Button, User } from "@nextui-org/react";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";

const JobListing: React.FC<> = ({}) => {
  // Your component logic here

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await axios.post("/api/job/get", {});

        setJobs(res.data[0].jobs);
      } catch {
        return toast.error("Sorry, This chat isn't available.");
      }
    };
  }, []);

  let id = "p";
  if (!id) return;

  id;

  return (
    <Link
      href={`/job/${id}`}
      className="w-[28rem] h-40 p-2 flex items-center bg-white overflow-clip"
    >
      <div className="flex">
        <div className="flex items-center">
          <User
            avatarProps={{
              src: `https://econnectbucket.s3.amazonaws.com/clpk06prs000f9kwpulpc9n33`,
            }}
            className="transition-transform"
            description={""}
            name={""}
          />
        </div>
        <div>
          <span className="text-blue-800 text-sm">{title}</span>
          <h3 className="font-bold mt-px text-black">{description}</h3>
          <div className="flex items-center gap-3 mt-2">
            <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm">
              {jobType}
            </span>
            <span className="text-slate-600 text-sm flex gap-1 items-center">
              {" "}
              <FaLocationDot /> {location}
            </span>
            <span className="text-slate-600 text-sm">{createdAt}</span>
          </div>
          <span className="text-slate-400 text-xs">Over 100 applicants</span>
        </div>
      </div>
    </Link>
  );
};

export default JobListing;
