"use client";
import React, { useEffect, useState } from "react";
import { User, Link, Skeleton } from "@nextui-org/react";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import prisma from "@/app/lib/prisma";
import axios from "axios";

interface UserInfo {
  id: string;
  email: string | null | undefined;
  fullName: string;
}

export default function UserPicture() {
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.post("/api/user/get", {});
      if (res.status === 200) {
        const data = await res.data;
        setUserInfo(data);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Skeleton className="w-12 h-12 rounded-md flex flex-col justify-between gap-2 m-4" />
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href={"/dashboard/profile"}>
        {isLoading ? (
          <Skeleton className="w-full h-24 rounded-md  " />
        ) : (
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: `https://econnectbucket.s3.amazonaws.com/image/${userInfo?.id}`,
            }}
            className="transition-transform"
            description={userInfo?.email}
            name={userInfo.firstName + " " + userInfo.lastName}
          />
        )}
      </Link>
    </div>
  );
}
