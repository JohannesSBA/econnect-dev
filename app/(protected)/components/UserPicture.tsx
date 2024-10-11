"use client";
import React, { useEffect } from "react";
import { User, Link, Skeleton } from "@nextui-org/react";
import { useUser } from "./functionComponents/UserContext";

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
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src:
                userInfo.image ||
                `https://econnectbucket.s3.amazonaws.com/image/${userInfo.id}`, // Fallback image logic
            }}
            className="transition-transform"
            description={userInfo.email || "No email available"} // Handle null email
            name={`${
              userInfo.firstName + " " + userInfo.lastName || "Anonymous"
            }`} // Handle null name
          />
        )}
      </Link>
    </div>
  );
}
