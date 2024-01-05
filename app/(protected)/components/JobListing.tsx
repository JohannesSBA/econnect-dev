import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import Image from "next/image";
import { User } from "@nextui-org/react";

interface JobListingProps {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  location: string;
  salary?: string;
  company: string;
  //   postedBy: User;
  //   postedById: string;
  //   applicants: User[];
}

const JobListing: React.FC<JobListingProps> = ({
  id,
  createdAt,
  title,
  description,
  location,
  salary,
  company,
  //   postedBy,
  //   postedById,
  //   applicants,
}) => {
  // Your component logic here

  return (
    <div className="relative flex min-h-screen flex-col jus items-center justify-center overflow-hidden bg-gray-50 p-6 sm:py-12">
      <div className="bg-white shadow-xl shadow-gray-100 w-full max-w-4xl flex flex-col sm:flex-row gap-3 sm:items-center  justify-between px-5 py-4 rounded-md">
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
            <span className="text-blue-800 text-sm">Engineering</span>
            <h3 className="font-bold mt-px text-black">
              Senior Full Stack Backend Engineer
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm">
                Full-time
              </span>
              <span className="text-slate-600 text-sm flex gap-1 items-center">
                {" "}
                <FaLocationDot /> Remote, UK
              </span>
              <span className="text-slate-600 text-sm">createdAt</span>
            </div>
            <span className="text-slate-400 text-xs">Over 100 applicants</span>
          </div>
        </div>
        <div>
          <button className="bg-blue-900 text-white font-medium px-4 py-2 rounded-md flex gap-1 items-center">
            Apply Now
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobListing;
