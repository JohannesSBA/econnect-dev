"use client";
import React, { useEffect, useState } from "react";
import {
    Avatar,
    Badge,
    Button,
    Input,
    Skeleton,
    Spinner,
} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { getSocketClient, initSocketClient, toPusherKey, safeEmit } from "@/app/lib/socket";
import { chatHrefConstructor } from "@/app/lib/utils";
import { Message } from "@/app/lib/validation";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { Friend } from "@/app/types/db";
import Link from "next/link";
import { FaUserFriends } from "react-icons/fa";
import axios from "axios";
import NotificationToast from "../NotificationToast";
interface MessageProps {
    userId: string;
    friends: Friend[];
    role: string;
}
export default function Messages({ userId, friends, role }: MessageProps) {
    const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [requestCounter, setRequestCounter] = useState(0);
    const pathName = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [messageType, setMessageType] = useState("all");
    const router = useRouter();
    useEffect(() => {
        // Filter friends based on the search term
        if (!friends) return;
        
        // Use a Map to track unique friends by ID
        const uniqueFriendsMap = new Map();
        
        friends.filter((friend) =>
            `${friend.firstName} ${friend.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        ).forEach(friend => {
            // Only add the friend if it's not already in the map
            if (!uniqueFriendsMap.has(friend.id)) {
                uniqueFriendsMap.set(friend.id, friend);
            }
        });
        
        // Convert the Map values back to an array
        const filtered = Array.from(uniqueFriendsMap.values());
        setFilteredFriends(filtered);
    }, [friends, searchTerm]);
    
    useEffect(() => {
        if (!userId) return;
        
        // First initialize the socket client if not already initialized
        initSocketClient();
        
        // Get a reference to the socket client
        const socket = getSocketClient();
        if (!socket) {
            console.error("Failed to get Socket.io client reference");
            return;
        }
        
        const userChannel = toPusherKey(`user:${userId}:chats`);
        
        // Use safeEmit for more reliable room joining
        safeEmit('join-room', userChannel, (response) => {
            if (response?.success) {
                console.log(`Successfully joined user channel from Messages component: ${userChannel}`);
            }
        });
        
        const chatHandler = (message: Message) => {
            const shouldNotify =
                pathName !==
                `/dashboard/chat/${chatHrefConstructor(
                    userId,
                    message.senderId
                )}`;
            if (!shouldNotify) return;
            toast.custom(() => {
                return (
                    <NotificationToast
                        sessionId={userId}
                        senderId={message.senderId}
                        senderImg={message.image}
                        senderName={message.id}
                        senderMessage={message.text}
                    />
                );
            });
        };
        
        // Bind to new message events
        socket.on("new_message", chatHandler);
        
        return () => {
            // Use safeEmit for leaving rooms as well
            safeEmit('leave-room', userChannel);
            
            // Remove event listeners
            socket.off("new_message", chatHandler);
        };
    }, [pathName, userId]);
    let requestElement;
    requestCounter > 0
        ? (requestElement = (
              <Badge content={requestCounter} color="primary">
                  <Link
                      href="/chat/friend-requests"
                      className="flex text-slate-800 rounded-md p-2 gap-2 items-center justify-center md:justify-normal"
                  >
                      <FaUserFriends />
                      <p className="text-md hidden md:flex">Requests</p>
                  </Link>
              </Badge>
          ))
        : (requestElement = (
              <Link
                  href="/chat/friend-requests"
                  className="flex text-slate-800 rounded-md p-2 gap-2 items-center"
              >
                  <FaUserFriends />
                  <p className="text-md flex">Requests</p>
              </Link>
          ));
    useEffect(() => {
        const friendRequestCounter = async () => {
            const getPending = await axios.post("/api/friends/requests", {});
            setRequestCounter(getPending.data[0].pendingFriendRequest.length);
            setIsLoading(false);
        };
        friendRequestCounter();
    }, [userId]);
    const checkImageExists = async (url: string) => {
        try {
            const response = await fetch(url);
            return response.ok;
        } catch (error) {
            return false;
        }
    };
    if (
        isLoading &&
        pathName &&
        !pathName.includes("profile") &&
        !pathName.includes("ec") &&
        !pathName.includes("employer-dashboard")
    )
        return (
            <div className="w-full h-full flex justify-center items-center">
                <Spinner />
            </div>
        );

    console.log(filteredFriends);
    return (
        <div
            className={
                pathName?.includes("profile") ||
                pathName?.includes("ec") ||
                pathName?.includes("employer-dashboard")
                    ? `hidden`
                    : `h-full flex flex-col bg-white rounded-lg overflow-hidden`
            }
        >
            <div className="flex flex-col p-4 space-y-4">
                <Input
                    type="text"
                    label="Search"
                    className="max-w-full bg-gray-50 rounded-lg"
                    endContent={<FaSearch className="text-gray-400" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <h2 className="font-semibold text-gray-700 text-sm px-2">
                    Messages
                </h2>

                <div className="space-y-2">
                    {filteredFriends.length === 0 ? (
                        <p className="text-gray-500 text-sm px-2">
                            No messages found
                        </p>
                    ) : (
                        filteredFriends.map((friend) => (
                            <div key={friend.id}>
                                <Button
                                    onClick={() => {
                                        router.push(
                                            `/chat/${chatHrefConstructor(
                                                userId,
                                                friend.id
                                            )}`
                                        );
                                    }}
                                    className="w-full p-3 py-6 bg-white hover:bg-blue-100 transition-colors duration-200 rounded-lg"
                                >
                                    <div className="flex items-center gap-4 w-full">
                                        <Avatar
                                            size="md"
                                            src={`https://econnectbucket.s3.amazonaws.com/image/${friend.id}`}
                                            className="border-2 border-gray-100"
                                            fallback="/user-avatar.png"
                                        />
                                        <div className="flex flex-col items-start">
                                            <p className="font-medium text-gray-800">
                                                {friend.firstName}{" "}
                                                {friend.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {friend.email}
                                            </p>
                                        </div>
                                    </div>
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {role === "EMPLOYEE" && (
                <div className="mt-auto border-t border-gray-100">
                    <div className="p-4 hover:bg-gray-50 transition-colors duration-200">
                        {requestElement}
                    </div>
                </div>
            )}
        </div>
    );
}
