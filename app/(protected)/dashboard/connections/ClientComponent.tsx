"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Friend, User } from "@/app/types/db";
import { chatHrefConstructor } from "@/app/lib/utils";
import {
    Button,
    Modal,
    ModalContent, 
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Badge,
} from "@nextui-org/react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import RequestHandler from "../../components/functionComponents/RequestHandler";
import { FaUserFriends } from "react-icons/fa";
import SideInfo from "../../components/visualComponents/SideInfo";
import FindPeople from "../../components/visualComponents/FindPeople";

interface ClientComponentProps {
    user: any;
    sessionId: string;
}

const ClientComponent: React.FC<ClientComponentProps> = ({
    user,
    sessionId,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("recent");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [requestCounter, setRequestCounter] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

    const connections = user.friends ?? [];
    const filteredConnections = connections.filter(
        (connection: { firstName: any; lastName: any }) =>
            `${connection.firstName} ${connection.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    const sortedConnections = filteredConnections.sort(
        (
            a: { createdAt: string | number | Date; lastName: any },
            b: { createdAt: string | number | Date; lastName: any }
        ) => {
            if (sortOption === "recent") {
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
            }
            if (sortOption === "lastName") {
                return (a.lastName ?? "").localeCompare(b.lastName ?? "");
            }
            return 0;
        }
    );

    const handleOpenModal = (connection: any) => {
        setSelectedFriend(connection);
        onOpen();
    };

    const removeFriend = async (friendId: string, email: string) => {
        try {
            const res = await axios.post("/api/friends/unfriend", {
                friendId: friendId,
                email: email,
            });
            if (res.status === 200) {
                toast.success("Friend removed successfully");
                window.location.reload();
            }
        } catch (error) {
            toast.error("Failed to remove friend, Please try again later");
        }
    };

    useEffect(() => {
        const friendRequestCounter = async () => {
            const getPending = await axios.post("/api/friends/requests", {});
            setRequestCounter(getPending.data[0].pendingFriendRequest.length);
            setIsLoading(false);
        };

        friendRequestCounter();
    }, [user.id]);

    const requestElement = requestCounter > 0 ? (
        <Badge content={requestCounter} color="primary">
            <Link
                href="/chat/friend-requests"
                className="flex text-slate-800 rounded-md p-2 gap-2 items-center hover:bg-slate-100 transition-colors"
            >
                <FaUserFriends className="text-xl" />
                <span className="text-sm font-medium">Requests</span>
            </Link>
        </Badge>
    ) : (
        <Link
            href="/chat/friend-requests"
            className="flex text-slate-800 rounded-md p-2 gap-2 items-center hover:bg-slate-100 transition-colors"
        >
            <FaUserFriends className="text-xl" />
            <span className="text-sm font-medium">Requests</span>
        </Link>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row gap-6 p-4 lg:p-6">
            <div className="w-full lg:w-3/4 space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h1 className="text-2xl font-bold text-slate-800">
                            {connections.length} Connections
                        </h1>
                        <div>{requestElement}</div>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Search connections..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-slate-500">Sort by:</span>
                            <button
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    sortOption === "recent"
                                        ? "bg-blue-100 text-blue-700 font-medium"
                                        : "hover:bg-slate-100"
                                }`}
                                onClick={() => setSortOption("recent")}
                            >
                                Recent
                            </button>
                            <button
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    sortOption === "lastName"
                                        ? "bg-blue-100 text-blue-700 font-medium"
                                        : "hover:bg-slate-100"
                                }`}
                                onClick={() => setSortOption("lastName")}
                            >
                                Last Name
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {sortedConnections.map((connection: any) => (
                        <div
                            key={connection.id}
                            className="bg-white rounded-xl shadow-sm p-6 transition-transform hover:scale-[1.02]"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={`https://econnectbucket.s3.amazonaws.com/image/${connection.id}`}
                                        alt="Profile"
                                        width={56}
                                        height={56}
                                        className="rounded-full object-cover w-14 h-14 aspect-square"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            {connection.firstName} {connection.lastName}
                                        </h3>
                                        <p className="text-sm text-slate-500">{connection.email}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-2">
                                    <Button
                                        as={Link}
                                        href={`/chat/${chatHrefConstructor(connection.id, sessionId)}`}
                                        color="primary"
                                        className="min-w-[100px]"
                                    >
                                        Message
                                    </Button>
                                    <Button
                                        as={Link}
                                        href={`/ec/${connection.id}`}
                                        color="default"
                                        className="min-w-[100px]"
                                    >
                                        Profile
                                    </Button>
                                    <Button
                                        color="danger"
                                        onPress={() => handleOpenModal(connection)}
                                        className="min-w-[100px]"
                                    >
                                        Unfriend
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <FindPeople />
                </div>
            </div>

            <div className="hidden lg:block lg:w-1/4">
                <div className="sticky top-6">
                    <SideInfo
                        user={user}
                        posts={user.posts}
                        applications={user.applications}
                    />
                </div>
            </div>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                backdrop="blur"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-xl font-bold">
                                Remove Connection
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    Are you sure you want to remove {selectedFriend?.firstName} from your connections? This action cannot be undone.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={() => removeFriend(
                                        selectedFriend?.id as string,
                                        selectedFriend?.email
                                    )}
                                >
                                    Remove
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default ClientComponent;
