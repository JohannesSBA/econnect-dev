import ChatInput from "@/app/(protected)/components/functionComponents/ChatInput";
import Conversations from "@/app/(protected)/components/visualComponents/Messaging/Conversations";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import {
    Avatar,
    Button,
    Link,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Tooltip,
    user,
} from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";
import { GiWaterDrop } from "react-icons/gi";
import Search from "../../components/SearchComponents/Search";
import SignOutButton from "../../components/functionComponents/SignOutButton";
import { Friend } from "@/app/types/db";
import ProtectedNav from "../../components/visualComponents/ProtectedNav";
import Messages from "../../components/visualComponents/Messaging/Messages";
import SideInfo from "../../components/visualComponents/SideInfo";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io";
import InfoDrawer from "../InfoDrawer";
import EmployerSideNav from "../../components/visualComponents/EmployerSideNav";

interface PageProps {
    params: {
        chatId: string;
    };
}

export async function generateMetadata({
    params,
}: {
    params: { chatid: string };
}) {
    const { chatid } = params;
    const session = await getServerSession(options);
    if (!session) notFound();

    const [id1, id2] = chatid.split("--");

    const friendId = id1 === session.user.id ? id2 : id1;
    const userId = id1 === session.user.id ? id1 : id2;

    const friendContent = await getUserContent(friendId);
    const userContent = await getUserContent(session.user.id);

    if (session.user.id !== userId) {
        notFound();
    }

    return { title: `Connected | ${friendContent.fullName} chat` };
}

interface PageProps {
    params: {
        chatId: string;
    };
}

const page = async ({ params }: { params: { chatid: string } }) => {
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
        <div className="h-screen w-screen overflow-clip font-PlusJakartaSans flex flex-col">
            {userInfo.role === "EMPLOYEE" && (
                <ProtectedNav
                    userInfoId={userInfo.id as string}
                    userName={userInfo.firstName + " " + userInfo.lastName}
                    userEmail={userInfo.email as string}
                />
            )}
            <div className="w-screen h-full overflow-clip flex bg-white">
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
                <div className="w-full md:w-4/5 h-full md:border border-white flex">
                    <div className="w-full h-full md:w-2/3 flex flex-col border border-white shadow-md m-1 p-1 pb-10">
                        <div className="flex justify-between gap-4 p-4 rounded-2xl shadow-sm bg-white backdrop-blur-lg">
                            <div className="flex gap-4">
                                <div className="flex items-center">
                                    {exists ? (
                                        <Avatar
                                            radius="lg"
                                            size="lg"
                                            src={`https://econnectbucket.s3.amazonaws.com/image/${friendContent.id}`}
                                            className="flex items-center border-2"
                                        />
                                    ) : (
                                        <Avatar
                                            radius="lg"
                                            size="lg"
                                            src="/user-avatar.png"
                                            className="flex items-center border-2"
                                        />
                                    )}
                                </div>
                                <h1 className="text-black flex flex-col justify-center font-bold">
                                    {friendContent.firstName}{" "}
                                    {friendContent.lastName}
                                </h1>
                            </div>

                            <div className="flex gap-2">
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
                        <Conversations
                            chatPartner={friendId as string}
                            chatId={userId as string}
                            chatRoom={chatid}
                        />
                        <div className="absolute bottom-0 w-full md:w-2/4 bg-white">
                            <ChatInput
                                chatPartner={friendId}
                                chatId={userId}
                                chatRoom={chatid}
                            />
                        </div>
                    </div>
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
