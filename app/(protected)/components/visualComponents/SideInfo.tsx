import { Button } from "@nextui-org/react";
import React from "react";
import { MdGroups } from "react-icons/md";
import { GiWaterDrop } from "react-icons/gi";
import UserPicture from "./UserPicture";
interface sideProps {
    user: any;
    posts: any;
    applications: any;
}
const SideInfo = ({ user, posts, applications }: sideProps) => {
    const connections = user.friends ?? [];
    return (
        <div className="h-full flex flex-col bg-white rounded-lg p-6">
            <div className="border-b border-gray-100 pb-6 flex justify-center">
                <UserPicture />
            </div>

            <div className="space-y-4 py-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center gap-3 text-gray-700">
                        <MdGroups className="w-5 h-5" />
                        <h2 className="font-medium">Your Connections</h2>
                    </div>
                    <span className="text-blue-500 font-semibold">
                        {connections.length}
                    </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center gap-3 text-gray-700">
                        <MdGroups className="w-5 h-5" />
                        <h2 className="font-medium">Your Posts</h2>
                    </div>
                    <span className="text-blue-500 font-semibold">
                        {posts?.length ?? 0}
                    </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center gap-3 text-gray-700">
                        <MdGroups className="w-5 h-5" />
                        <h2 className="font-medium">Open Job Applications</h2>
                    </div>
                    <span className="text-blue-500 font-semibold">
                        {applications?.length ?? 0}
                    </span>
                </div>
            </div>

            <a href="/dashboard/profile" className="mt-6">
                <Button
                    variant="solid"
                    className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                >
                    View Your Profile
                </Button>
            </a>

            <div className="mt-auto pt-6">
                <div className="grid grid-cols-4 gap-4 text-center text-sm text-gray-500">
                    <a
                        href="/about"
                        target="_blank"
                        className="hover:text-gray-700"
                    >
                        About
                    </a>
                    <span className="hover:text-gray-700 cursor-pointer">
                        Accessibility
                    </span>
                    <span className="hover:text-gray-700 cursor-pointer">
                        Privacy & Terms
                    </span>
                    <span className="hover:text-gray-700 cursor-pointer">
                        FAQ&apos;s
                    </span>
                    <span className="col-start-2 hover:text-gray-700 cursor-pointer">
                        Advertising
                    </span>
                    <span className="hover:text-gray-700 cursor-pointer">
                        Contact
                    </span>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mt-6">
                    <GiWaterDrop />
                    <span>Econnect Corporation © 2024</span>
                </div>
            </div>
        </div>
    );
};
export default SideInfo;
