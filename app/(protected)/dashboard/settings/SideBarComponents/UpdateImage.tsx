"use client";
import React from "react";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import ProfileImage from "@/app/(protected)/components/functionComponents/ProfileImage";
import { Camera } from "lucide-react";
interface User {
    firstName: string;
    id: string;
    lastName: string;
    bio: string;
    title: string;
    location: string;
    pronouns: string;
}
interface AppProps {
    user: User;
}
export default function UpdateImage({ user }: AppProps) {
    return (
        <Card
            className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl"
            fullWidth
        >
            <CardHeader className="flex flex-col gap-3 p-6 text-center bg-gradient-to-r from-blue-50 to-indigo-50">
                <h1 className="text-xl font-semibold text-gray-800">
                    Profile Picture
                </h1>
                <p className="text-sm text-gray-600">
                    Update your profile image
                </p>
            </CardHeader>
            <CardBody className="flex flex-col items-center gap-6 p-8">
                <div className="relative group cursor-pointer">
                    <div className="relative">
                        <div className="z-40">
                            <ProfileImage id={user.id} />
                        </div>
                        {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all duration-300 flex items-center justify-center">
                            <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div> */}
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-lg font-medium text-gray-700">
                        {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-sm text-gray-500">
                        Click on the image above to update your profile picture
                    </p>
                    <p className="text-xs text-gray-500">
                        {" "}
                        Image can sometimes take a while to update across all
                        pages
                    </p>
                </div>
            </CardBody>
        </Card>
    );
}
