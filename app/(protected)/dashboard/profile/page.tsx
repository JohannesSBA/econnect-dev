import React from "react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { getUserContent } from "@/app/helpers/getUser";
import { getEducation } from "@/app/helpers/getEducation";
import { getExperience } from "@/app/helpers/getExperience";
import ClientComponent from "./ClientComponent";

const Page = async () => {
    const session = await getServerSession(options);
    
    if (!session?.user.id) {
        redirect("/auth/signin");
    }

    const userInfo = await getUserContent(session.user.id);

    if (userInfo.role === "EMPLOYER") {
        redirect("/employer-dashboard/profile");
    }

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
    const parsedExperience = experienceList as {
        title: string;
        employmentType: string;
        companyName: string;
        locationName: string;
        locationType: string;
        currently: boolean;
        startDate: Date;
        endDate: Date | null;
        description: string | null;
    }[];

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-white to-blue-100">
            <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
                <ClientComponent
                    user={{
                        name: `${userInfo.firstName} ${userInfo.lastName}`,
                        id: session.user.id,
                        title: userInfo.title || "No title set",
                        location: userInfo.location || "No location set",
                        about: userInfo.bio || "No bio available",
                    }}
                    experiences={parsedExperience}
                    education={parsedEducation}
                    skills={[]} // userInfo type doesn't include skills property
                    contact={{
                        email: userInfo.email || "",
                        phone: userInfo.phoneNumber || "No phone number set",
                    }} languages={[]}                    // skills={[]} // userInfo type doesn't include skills property
                />
            </div>
        </div>
    );
};

export default Page;
