import ChatInput from "@/app/(protected)/components/functionComponents/ChatInput";
import Conversations from "@/app/(protected)/components/visualComponents/Messaging/Conversations";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import {
    Avatar,
    Button,
    Link,
    Tooltip,
} from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";
import { Friend } from "@/app/types/db";
import ProtectedNav from "../../components/visualComponents/ProtectedNav";
import Messages from "../../components/visualComponents/Messaging/Messages";
import SideInfo from "../../components/visualComponents/SideInfo";
import { FaRegUserCircle } from "react-icons/fa";
import InfoDrawer from "../InfoDrawer";
import EmployerSideNav from "../../components/visualComponents/EmployerSideNav";

interface PageProps {
    params: {
        chatid: string;
    };
}

export async function generateMetadata({
    params,
}: PageProps) {
    const { chatid } = params;
    const session = await getServerSession(options);
    if (!session) notFound();

    const [id1, id2] = chatid.split("--");

    const friendId = id1 === session.user.id ? id2 : id1;
    const userId = id1 === session.user.id ? id1 : id2;

    const friendContent = await getUserContent(friendId);

    if (session.user.id !== userId) {
        notFound();
    }

    return { title: `Connected | ${friendContent.fullName} chat` };
}

const page = async ({ params }: PageProps) => {
    const { chatid } = params;
    const session = await getServerSession(options);
    if (!session) notFound();

    const [id1, id2] = chatid.split("--");

    const friendId = id1 === session.user.id ? id2 : id1;
    const userId = id1 === session.user.id ? id1 : id2;

    const userInfo = await getUserContent(session?.user.id as string);
    const friendContent = await getUserContent(friendId);

    const friendsList = userInfo.friends as unknown as Friend[];

    if (session.user.id !== userId) {
        notFound();
    }

    const checkImageExists = async (url: string): Promise<boolean> => {
        try {
            const response = await fetch(url);
            return response.ok;
        } catch {
            return false;
        }
    };
    const exists = await checkImageExists(
        `https://econnectbucket.s3.amazonaws.com/image/${friendContent.id}`
    );

    return (
        <div className="h-screen w-screen overflow-hidden font-PlusJakartaSans flex flex-col">
            {userInfo.role === "EMPLOYEE" && (
                <ProtectedNav
                    userInfoId={userInfo.id as string}
                    userName={userInfo.firstName + " " + userInfo.lastName}
                    userEmail={userInfo.email as string}
                />
            )}
            <div className="flex flex-1 overflow-hidden bg-white">
                {/* Sidebar */}
                <div className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 flex-shrink-0">
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
                
                {/* Main content */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Chat area */}
                    <div className="flex-1 flex flex-col border border-gray-100 shadow-md m-1 relative">
                        {/* Chat header */}
                        <div className="flex justify-between gap-4 p-4 rounded-2xl shadow-sm bg-white sticky top-0 z-10">
                            <div className="flex gap-4 items-center">
                                <div>
                                    {exists ? (
                                        <Avatar
                                            radius="lg"
                                            size="lg"
                                            src={`https://econnectbucket.s3.amazonaws.com/image/${friendContent.id}`}
                                            className="border-2"
                                        />
                                    ) : (
                                        <Avatar
                                            radius="lg"
                                            size="lg"
                                            src="/user-avatar.png"
                                            className="border-2"
                                        />
                                    )}
                                </div>
                                <h1 className="text-black font-bold truncate">
                                    {friendContent.firstName}{" "}
                                    {friendContent.lastName}
                                </h1>
                            </div>

                            <div className="flex gap-2 flex-shrink-0">
                                <Tooltip content="Go to User Profile">
                                    <Button
                                        as={Link}
                                        href={`/ec/${friendContent.id}`}
                                        isIconOnly
                                        variant="flat"
                                    >
                                        <FaRegUserCircle className="scale-125" />
                                    </Button>
                                </Tooltip>
                                <InfoDrawer
                                    friendId={friendContent.id}
                                    friendName={
                                        friendContent.firstName +
                                        " " +
                                        friendContent.lastName
                                    }
                                />
                            </div>
                        </div>
                        
                        {/* Conversation area */}
                        <div className="flex-1 overflow-y-auto mb-16">
                            <Conversations
                                chatPartner={friendId as string}
                                chatId={userId as string}
                                chatRoom={chatid}
                            />
                        </div>
                        
                        {/* Chat input */}
                        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-2">
                            <ChatInput
                                chatPartner={friendId}
                                chatId={userId}
                                chatRoom={chatid}
                            />
                        </div>
                    </div>
                    
                    {/* Side panel - only visible on larger screens */}
                    <div className="hidden md:block md:w-1/3 lg:w-1/4 bg-white rounded-lg shadow-lg transition-all duration-300 overflow-auto">
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
