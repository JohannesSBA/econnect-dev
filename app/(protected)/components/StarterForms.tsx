"use client";

import { Button, Pagination } from "@nextui-org/react";
import React, { useEffect } from "react";
import ProfileImage from "./ProfileImage";
import Search from "./Search";
import EditContent from "./EditContent";
import { User } from "@/app/types/db";
import axios from "axios";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect, useRouter } from "next/navigation";

interface starterProps {
    user: User;
}

const StarterForms = ({ user }: starterProps) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const router = useRouter();

    async function finish() {
        const res = await axios.post("/api/user/started", {
            id: user.id,
        });
        router.push("/dashboard");
    }

    return (
        <div className="h-full w-full flex justify-between overflow-none">
            <div className="absolute flex justify-center items-center w-full ml-12">
                <div className="hidden md:flex -rotate-12 top-0 -translate-y-28 translate-x-60 right-auto w-[26rem] h-[30rem] border border-slate-900 bg-blue-400 mix-blend-multiply"></div>
                <div className="hidden md:flex top-0 right-auto rotate-12 w-[26rem] h-[30rem] border border-slate-900 bg-blue-300 opacity-95 mix-blend-multiply"></div>
            </div>
            <div className="w-1/4 flex flex-col justify-between py-16">
                <h1 className="absolute md:relative z-50 font-semibold text-blue-700 text-2xl opacity-80 px-5">
                    Econnect
                </h1>
                <h1 className="hidden md:flex font-semibold text-[#7F8CA6] text-4xl px-5 leading-9">
                    This is where you personalise your profile to stand out to
                    employers
                </h1>
            </div>
            <div className="md:w-2/5 w-full md:shadow-md backdrop-blur-md rounded-md md:bg-white/60 h-5/6 mt-12 flex flex-col justify-between items-center py-8">
                <span className="w-full flex justify-center">
                    {(() => {
                        switch (currentPage) {
                            case 1:
                                return (
                                    <div className="md:w-80 pt-12 md:pt-0 flex flex-col gap-8 items-center">
                                        <ProfileImage id={""} />
                                    </div>
                                );
                            case 2:
                                return (
                                    <div className="w-96 h-96 mt-12 flex flex-col justify-center items-center">
                                        <h1 className="font-semibold text-center mb-8 md:mx-0 mx-8">
                                            This is where You get to Talk about
                                            who you are as a person. Fill out
                                            the Click on the Edit Content button
                                            and Fill out the required
                                            information for people to understand
                                            you
                                        </h1>
                                        <EditContent
                                            userBio={user.bio as string}
                                            userName={user.firstName as string}
                                            userPronouns={user.pronouns}
                                            userLocation={
                                                user.location as string
                                            }
                                            userCPosition={""}
                                            userTitle={user.title as string}
                                        />
                                    </div>
                                );
                            default:
                                return;
                        }
                    })()}
                </span>
                <div className="w-full flex flex-col gap-2 items-center">
                    <h1>Hello {user.firstName}</h1>
                    <Pagination
                        total={2}
                        color="primary"
                        page={currentPage}
                        onChange={setCurrentPage}
                    />
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            onPress={() =>
                                setCurrentPage((prev) =>
                                    prev > 1 ? prev - 1 : prev
                                )
                            }
                        >
                            Previous
                        </Button>
                        {currentPage != 2 ? (
                            <Button
                                size="sm"
                                variant="flat"
                                color="primary"
                                onPress={() =>
                                    setCurrentPage((prev) =>
                                        prev < 2 ? prev + 1 : prev
                                    )
                                }
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                color="primary"
                                onClick={() => {
                                    finish();
                                }}
                            >
                                Finish
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-1/4"></div>
        </div>
    );
};

export default StarterForms;
