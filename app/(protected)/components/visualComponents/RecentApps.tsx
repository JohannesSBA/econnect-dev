"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@nextui-org/react";
import { FiExternalLink, FiAirplay } from "react-icons/fi";

interface recentAppsProps {
  user: string;
  applicants: any[];
}

// type Message = z.infer<typeof messageValidator>;

const RecentApps: React.FC<recentAppsProps> = ({ user, applicants }) => {
  const recentApplications = applicants
    ?.map((application: any) => ({
      id: application.id,
      information: application.infromation, // Assuming jobTitle is the correct field
      createdAt: application.updatedAt,
    }))
    .sort(
      (
        a: { createdAt: string | number | Date },
        b: { createdAt: string | number | Date }
      ) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 2);

  return (
    <div className="sticky left-0 hidden w-44 shrink-0 lg:flex p-2">
      {/* Left column area */}
      <div className="text-2xl text-slate-800 font-semibold">
        Recent Applications
        <div className="h-[600px] w-full flex flex-col gap-2">
          {applicants?.length === 0 && (
            <div className="text-sm font-semibold text-slate-400">
              No recent applications
            </div>
          )}
          <div className="w-full h-full">
            {recentApplications?.map(
              (application: {
                id: string;
                information: string;
                createdAt: string;
              }) => (
                <div
                  key={application.id}
                  className="flex items-center gap-4 border-y-2 w-full justify-start"
                >
                  <div className="flex p-6 gap-2">
                    <Image
                      width={50}
                      height={50}
                      className="rounded-full"
                      alt="Application Image"
                      src={`https://econnectbucket.s3.amazonaws.com/image/${
                        application.information
                          .split("!postedBy!")[1]
                          .split("!")[0]
                      }`}
                    />
                    <h2 className="text-xs font-semibold line-clamp-2">
                      {application.information.split("!jobTitle!")[1]}
                    </h2>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <div>
          <Link className="flex gap-3" href="/listings">
            <FiAirplay />
            <h2 className="text-sm">Explore</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentApps;
