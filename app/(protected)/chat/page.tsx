import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { getServerSession } from "next-auth";
import { notFound, usePathname } from "next/navigation";
import React from "react";
import { Friend } from "@/app/types/db";
import ProtectedNav from "../components/visualComponents/ProtectedNav";
import SideInfo from "../components/visualComponents/SideInfo";
import Messages from "../components/visualComponents/Messaging/Messages";
import EmployerSideNav from "../components/visualComponents/EmployerSideNav";
import { IoChatbox } from "react-icons/io5";

interface PageProps {
    params: {
        chatId: string;
    };
}

const page = async ({ params }: { params: { chatid: string } }) => {
    const { chatid } = params;
    const session = await getServerSession(options);
    if (!session) notFound();

    const userInfo = await getUserContent(session?.user.id as string);
    const friendsList = userInfo.friends as unknown as Friend[];

    return (
        <div className="min-h-screen  bg-gradient-to-br from-slate-50 to-blue-50 font-PlusJakartaSans">
            {userInfo.role === "EMPLOYEE" && (
                <ProtectedNav
                    userInfoId={userInfo.id as string}
                    userName={userInfo.firstName + " " + userInfo.lastName}
                    userEmail={userInfo.email as string}
                />
            )}

            <div className=" w-screen px-4 py-6 flex gap-6 h-[calc(100vh-4rem)] ">
                <div className="w-full md:w-1/4 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                    {userInfo.role === "EMPLOYEE" ? (
                        <Messages
                            userId={session?.user.id as string}
                            friends={friendsList}
                            role={userInfo.role ?? ""}
                        />
                    ) : (
                        <EmployerSideNav
                            userInfo={userInfo}
                            userId={session.user.id}
                        />
                    )}
                </div>

                <div className="hidden md:block w-2/4 bg-white rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center space-y-8">
                            <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110">
                                <IoChatbox className="w-10 h-10 text-blue-500" />
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-3xl font-bold text-gray-800">
                                    Your Messages
                                </h1>
                                <p className="text-gray-500 text-lg">
                                    Select a User to start Chatting
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block w-1/4">
                    <div className="bg-white rounded-lg shadow-lg h-full transition-all duration-300 hover:shadow-xl">
                        {userInfo.role === "EMPLOYEE" ? (
                            <SideInfo
                                user={userInfo}
                                posts={userInfo.posts}
                                applications={userInfo.applicant}
                            />
                        ) : (
                            <Messages
                                userId={session?.user.id as string}
                                friends={friendsList}
                                role={userInfo.role ?? ""}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;
