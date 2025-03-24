import React from "react";
import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import RequestHandler from "../../components/functionComponents/RequestHandler";
import { getUserContent } from "@/app/helpers/getUser";
import { Friend } from "@/app/types/db";
import ProtectedNav from "../../components/visualComponents/ProtectedNav";
import Messages from "../../components/visualComponents/Messaging/Messages";

const page = async () => {
    const session = await getServerSession(options);

    if (!session) return;

    const userInfo = await getUserContent(session?.user.id as string);
    const friendsList = userInfo.friends as unknown as Friend[];

    const getPending = await prisma.user.findMany({
        where: {
            email: session.user.email as string,
        },
        select: {
            pendingFriendRequest: true,
        },
    });

    const pendingList = getPending[0].pendingFriendRequest;

    return (
        <div className="min-h-screen w-full overflow-hidden font-PlusJakartaSans flex flex-col bg-gradient-to-br from-white to-blue-50">
            <ProtectedNav
                userInfoId={userInfo.id as string}
                userName={userInfo.firstName + " " + userInfo.lastName}
                userEmail={userInfo.email as string}
            />
            
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Sidebar - Messages */}
                <div className="w-full md:w-1/4 lg:w-1/5 border-r border-slate-200 bg-white shadow-sm">
                    <div className="h-full overflow-y-auto">
                        <Messages
                            userId={session?.user.id as string}
                            friends={friendsList}
                            role={userInfo?.role as string}
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="p-6 bg-white shadow-sm">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Friend Requests
                        </h1>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 md:p-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                                <RequestHandler
                                    incomingFriendRequest={pendingList}
                                    sessionEmail={session.user.email as string}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;
