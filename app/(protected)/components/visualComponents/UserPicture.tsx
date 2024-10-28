"use client";
import React, { useEffect } from "react";
import { User, Link, Skeleton } from "@nextui-org/react";
import Image from "next/image";
import { useUser } from "../functionComponents/UserContext";

export default function UserPicture() {
    const userContext = useUser();
    const userInfo = userContext ? userContext.userInfo : null;
    const isLoading = userContext ? !userInfo : true; // Adjust loading state based on context

    return (
        <div className="flex items-center gap-4">
            <Link href={"/dashboard/profile"}>
                {isLoading ? (
                    <Skeleton className="w-full h-24 rounded-md" />
                ) : (
                    <div className="flex gap-1">
                        <Image
                            src={`https://econnectbucket.s3.amazonaws.com/image/${userInfo.id}`}
                            alt="profile picture"
                            width={50}
                            height={50}
                            className="border-4 border-slate-400 justify-center object-cover rounded-full bg-slate-200 w-12 h-12"
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
