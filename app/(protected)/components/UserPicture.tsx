"use client";
import React, { useEffect } from "react";
import { User, Link, Skeleton } from "@nextui-org/react";
import { useUser } from "./functionComponents/UserContext";
import Image from "next/image";

export default function UserPicture() {
  const userContext = useUser();
  const userInfo = userContext ? userContext.userInfo : null;
  const isLoading = userContext ? !userInfo : true; // Adjust loading state based on context

  useEffect(() => {
    if (userInfo) {
      console.log("User Info:", userInfo); // Log user info for debugging
    }
  }, [userInfo]);

  return (
    <div className="flex items-center gap-4">
      <Link href={"/dashboard/profile"}>
        {isLoading ? (
          <Skeleton className="w-full h-24 rounded-md" />
        ) : (
          <div className="flex gap-1">
            <Image
              src={`https://econnectbucket.s3.amazonaws.com/image/${userInfo.id}`}
              alt="profile piture"
              width={50}
              height={50}
              className="border-4 border-slate-400 justify-center object-contain rounded-full bg-slate-200"
            />

            <div className="flex flex-col">
              <h3 className=" text-sm">
                {userInfo.firstName + " " + userInfo.lastName}
              </h3>
              <p className="text-xs text-light text-slate-600">
                {userInfo.email}
              </p>
            </div>
          </div>
        )}
      </Link>
    </div>
  );
}
