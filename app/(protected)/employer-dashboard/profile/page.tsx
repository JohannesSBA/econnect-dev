import React from "react";
import EditContent from "../../components/functionComponents/EditContent";
import { getUserContent } from "@/app/helpers/getUser";
import { Button, Card, Image } from "@nextui-org/react";
import ProfileImage from "../../components/ProfileImage";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import UploadResume from "../../components/UploadResume";
import { FiExternalLink, FiMessageSquare, FiUserPlus } from "react-icons/fi";
import Posts from "../../components/Posts";
import NewEducation from "../../components/NewEducation";
import { getEducation } from "@/app/helpers/getEducation";
import NewExperience from "../../components/NewExperience";
import { getExperience } from "@/app/helpers/getExperience";

const page = async () => {
    const session = await getServerSession(options);
    const userInfo = await getUserContent(session?.user.id as string);

    const educationList = await getEducation(userInfo.id as string);
    const parsedEducation = educationList as {
        school: string;
        degree: string;
        GPA: number | null;
        major: string;
        startDate: Date;
        endDate: Date;
        description: string | null;
    }[];

    const experienceList = await getExperience(userInfo.id as string);
    const parsedExperience = experienceList as unknown as {
        title: string;
        EmploymentType: string;
        CompanyName: string;
        LocationName: string;
        LocationType: string;
        currently: Boolean;
        startDate: Date;
        endDate: Date | null;
        Description: string | null;
    }[];

    const numOfConnection = userInfo.friends?.length ?? 0;

    const dateJoined = userInfo.emailVerified;

    function formatDate(dateString: string | number | Date) {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }

    return (
        <div className="w-screen h-[calc(100vh-5rem)] flex bg-[#F4F2EE]">
            <div className="w-1/3 h-full flex flex-col px-8 bg-white/75 m-2 rounded-md">
                <ProfileImage id={session?.user.id as string} />
                <div className="w-full flex flex-col justify-center items-center mb-12">
                    <h1 className="text-2xl text-slate-800 font-semibold">
                        {userInfo.fullName}
                    </h1>
                    <h1 className="text-lg text-blue-400">{userInfo.title}</h1>
                    <h2 className="text-slate-800 line-clamp-24 my-2">
                        {userInfo.bio}
                    </h2>
                </div>

                <div className="w-full flex flex-col justify-around gap-8">
                    <div className="flex flex-col w-full">
                        <div className="flex justify-between ">
                            <h1 className="text-[#727171]">Followers</h1>
                            <h1 className="text-black">{numOfConnection}</h1>
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="flex justify-between ">
                            <h1 className="text-[#727171]">Location</h1>
                            <h1 className="text-black">{userInfo.location}</h1>
                        </div>
                        <div className="flex justify-between ">
                            <h1 className="text-[#727171]">Joined</h1>
                            <h1 className="text-black">
                                {dateJoined
                                    ? new Date(dateJoined).toLocaleDateString()
                                    : "N/A"}
                            </h1>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
            <div className="w-1/3 h-full p-8 text-slate-800 bg-white/75 m-2 rounded-md">
                <div className="w-full m-2  overflow-y-scroll scrollbar-thin scrollbar-webkit overflow-x-hidden">
                    <h1 className="text-[#4773C5] text-2xl text-end sticky pt-1 top-0 w-full backdrop-blur-md z-20">
                        Posts
                    </h1>
                    <Posts
                        id={userInfo?.id as string}
                        userId={userInfo?.id as string}
                        fromPage="his"
                    />
                </div>
            </div>
            <div className="w-1/3 h-full p-8 text-slate-800 bg-white/75 m-2 rounded-md">
                <div className="w-full h-full flex flex-col">
                    <div className="m-2  h-full w-full rounded-3xl flex flex-col justify-between ">
                        <EditContent
                            userBio={userInfo.bio as string}
                            userName={userInfo.firstName as string}
                            userPronouns={userInfo.pronouns}
                            userLocation={userInfo.location as string}
                            userCPosition={userInfo.currentPosition as string}
                            userTitle={userInfo.title as string}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;
