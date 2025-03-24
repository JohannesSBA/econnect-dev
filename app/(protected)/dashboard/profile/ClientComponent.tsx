"use client";

import { useState } from "react";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import {
    MdLocationOn,
    MdEmail,
    MdPhone,
    MdFileDownload,
    MdPinDrop,
    MdOutlinePostAdd,
    MdWork,
    MdSchool,
    MdPerson
} from "react-icons/md";
import { Link } from "@nextui-org/react";
import UploadResume from "../../components/functionComponents/UploadResume";
import NewExperience from "../../components/functionComponents/NewExperience";
import NewEducation from "../../components/functionComponents/NewEducation";

interface UserProfileProps {
    user: {
        id: string;
        name: string;
        title: string;
        location: string;
        about: string;
    };
    experiences: any[];
    education: any[];
    skills: any[];
    contact: {
        email: string;
        phone: string;
    };
    languages: string[];
}

export default function UserProfile(UserProfile: UserProfileProps) {
    const [experiences, setExperiences] = useState(UserProfile.experiences);
    const [education, setEducation] = useState(UserProfile.education);

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar - Moved to top on mobile */}
                    <div className="lg:col-span-1 order-1 lg:order-2 space-y-6">
                        <Card className="bg-white/70 backdrop-blur-sm shadow-md">
                            <CardBody className="p-6">
                                <div className="flex flex-col items-center">
                                    <Avatar
                                        src={`https://econnectbucket.s3.amazonaws.com/image/${UserProfile.user.id}`}
                                        className="w-32 h-32 mb-4"
                                        alt={UserProfile.user.name}
                                    />
                                    <h1 className="text-2xl font-bold text-center mb-2">{UserProfile.user.name}</h1>
                                    <p className="text-lg text-gray-600 text-center mb-4">{UserProfile.user.title}</p>
                                    <div className="w-full space-y-3">
                                        <div className="flex items-center text-gray-600">
                                            <MdEmail className="w-5 h-5 mr-3" />
                                            <span className="text-sm">{UserProfile.contact.email}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <MdPhone className="w-5 h-5 mr-3" />
                                            <span className="text-sm">{UserProfile.contact.phone}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <MdLocationOn className="w-5 h-5 mr-3" />
                                            <span className="text-sm">{UserProfile.user.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <Card className="bg-white/70 backdrop-blur-sm shadow-md">
                            <CardHeader>
                                <h2 className="text-xl font-semibold">Quick Actions</h2>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                <Button
                                    as={Link}
                                    href="/dashboard/my-posts"
                                    color="primary"
                                    className="w-full"
                                    startContent={<MdOutlinePostAdd />}
                                >
                                    View Posts
                                </Button>
                                <Button
                                    as={Link}
                                    href={`https://econnectbucket.s3.amazonaws.com/resume/${UserProfile.user.id}`}
                                    color="primary"
                                    className="w-full"
                                    startContent={<MdFileDownload />}
                                    target="_blank"
                                >
                                    View Resume
                                </Button>
                                <UploadResume />
                            </CardBody>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 order-2 lg:order-1 space-y-6">
                        <Card className="bg-white/70 backdrop-blur-sm shadow-md">
                            <CardHeader className="flex gap-3">
                                <MdPerson className="w-6 h-6" />
                                <h2 className="text-xl font-semibold">About</h2>
                            </CardHeader>
                            <CardBody>
                                <p className="text-gray-700 leading-relaxed">{UserProfile.user.about}</p>
                            </CardBody>
                        </Card>

                        <Card className="bg-white/70 backdrop-blur-sm shadow-md">
                            <CardHeader className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <MdWork className="w-6 h-6" />
                                    <h2 className="text-xl font-semibold">Experience</h2>
                                </div>
                                <NewExperience />
                            </CardHeader>
                            <CardBody className="space-y-6">
                                {experiences.length === 0 ? (
                                    <p className="text-gray-500 text-center">No experiences to display</p>
                                ) : (
                                    experiences.map((exp, index) => (
                                        <div key={index} className="relative">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                                                    <p className="text-gray-600">{exp.companyName}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(exp.startDate).toLocaleDateString()} - {" "}
                                                        {exp.endDate === null ? "Present" : new Date(exp.endDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <ul className="mt-3 space-y-2 text-gray-700">
                                                {exp.description.split("\n").map((desc: string, descIndex: number) => (
                                                    <li key={descIndex} className="flex items-start">
                                                        <span className="mr-2">•</span>
                                                        <span>{desc}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            {index < experiences.length - 1 && <Divider className="my-4" />}
                                        </div>
                                    ))
                                )}
                            </CardBody>
                        </Card>

                        <Card className="bg-white/70 backdrop-blur-sm shadow-md">
                            <CardHeader className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <MdSchool className="w-6 h-6" />
                                    <h2 className="text-xl font-semibold">Education</h2>
                                </div>
                                <NewEducation />
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-6">
                                    {education.map((edu, index) => (
                                        <div key={index} className="relative">
                                            <div className="flex flex-col">
                                                <h3 className="text-lg font-semibold text-gray-900">{edu.school}</h3>
                                                <p className="text-gray-600">{edu.degree} Degree</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(edu.startDate).toLocaleDateString()} - {" "}
                                                    {edu.endDate === null ? "Present" : new Date(edu.endDate).toLocaleDateString()}
                                                </p>
                                                <p className="text-gray-700 mt-1">GPA: {edu.GPA}</p>
                                            </div>
                                            {edu.description && (
                                                <ul className="mt-3 space-y-2 text-gray-700">
                                                    {edu.description.split("\n").map((desc: string, descIndex: number) => (
                                                        <li key={descIndex} className="flex items-start">
                                                            <span className="mr-2">•</span>
                                                            <span>{desc}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {index < education.length - 1 && <Divider className="my-4" />}
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
