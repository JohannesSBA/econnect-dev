import React from "react";
import EditContent from "../../components/functionComponents/EditContent";
import { getUserContent } from "@/app/helpers/getUser";
import { Button, Card, Link } from "@nextui-org/react";
import ProfileImage from "../../components/functionComponents/ProfileImage";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import UploadResume from "../../components/functionComponents/UploadResume";
import { FiExternalLink, FiMessageSquare, FiUserPlus } from "react-icons/fi";
import NewEducation from "../../components/functionComponents/NewEducation";
import { getEducation } from "@/app/helpers/getEducation";
import NewExperience from "../../components/functionComponents/NewExperience";
import { getExperience } from "@/app/helpers/getExperience";
import Posts from "../../components/visualComponents/Posts/Post";
import ClientComponent from "./ClientComponent";

const page = async () => {
    const session = await getServerSession(options);
    const userInfo = await getUserContent(session?.user.id as string);
    const pageName = "profile";

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
        <div className="w-screen  flex flex-col md:flex-row md:overflow-clip bg-gradient-to-br from-white to-blue-100">
            <ClientComponent
                user={{
                    name: userInfo.firstName + " " + userInfo.lastName,
                    id: session?.user.id as string,
                    title: userInfo.title,
                    location: userInfo.location,
                    about: userInfo.bio,
                }}
                experiences={parsedExperience}
                education={parsedEducation}
                skills={[]}
                contact={{
                    email: userInfo.email as string,
                    phone: userInfo.phoneNumber as string,
                }}
                languages={[]}
            />
        </div>
    );
};

export default page;
