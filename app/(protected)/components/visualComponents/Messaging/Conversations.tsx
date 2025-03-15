"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import parse from "html-react-parser";
import WaterDropletLoader from "@/app/components/WaterDropLoader";
import { getSocketClient, initSocketClient, safeEmit } from "@/app/lib/socket";
import { toPusherKey } from "@/app/lib/utils";

interface Message {
    id: string;
    senderId: string;
    text: string;
    createdAt: string;
    readBy: string[];
}

interface ConversationProps {
    chatPartner: string;
    chatId: string;
    chatRoom: string;
}

export default function Conversations({
    chatPartner,
    chatId,
    chatRoom,
}: ConversationProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userReadStatus, setUserReadStatus] = useState<
        Record<string, boolean>
    >({});
    const [loading, setLoading] = useState<boolean>(true);
    const scrollDownRef = useRef<HTMLDivElement | null>(null);

    // Get all Messages in the conversation
    useEffect(() => {
        const getMessage = async () => {
            try {
                const res = await axios.post("/api/message/get", {
                    chatPartner,
                    chatId,
                });
                const sortedMessages = res.data.sort(
                    (a: Message, b: Message) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                );
                setMessages(sortedMessages);

                await axios.post("/api/message/mark-as-read", {
                    messageIds: sortedMessages,
                });

                const initialReadStatus: Record<string, boolean> = {};
                sortedMessages.forEach((message: Message) => {
                    initialReadStatus[message.id] = message.readBy.length > 0;
                });
                setUserReadStatus(initialReadStatus);
            } catch (error) {
                toast.error("Sorry, this chat isn't available.");
            } finally {
                setLoading(false);
                if (scrollDownRef.current) {
                    scrollDownRef.current.scrollIntoView({
                        behavior: "smooth",
                    });
                }
            }
        };

        getMessage();
    }, [chatId, chatPartner]);

    // Set up Socket.IO connection for real-time messaging
    useEffect(() => {
        // Initialize socket connection
        initSocketClient().catch(error => {
            console.error('Failed to initialize socket connection:', error);
            toast.error('Connection error. Messages may be delayed.');
        });
        
        const socket = getSocketClient();
        
        if (!socket) {
            console.error('Socket connection not available');
            toast.error('Connection error. Real-time messaging unavailable.');
            return () => {
                // Empty cleanup if no socket
            };
        }
        
        // Join the chat room
        const roomKey = toPusherKey(`chat:${chatRoom}`);
        // Use safeEmit to handle connection state properly
        safeEmit('join-room', roomKey)

        // Handle incoming messages
        const messageHandler = (message: Message) => {
            setMessages((prev) => [...prev, message]);
            setUserReadStatus((prev) => ({ ...prev, [message.id]: false }));
        };
        
        // Handle message read notifications
        const messageReadHandler = (message: Message) => {
            setUserReadStatus((prev) => ({ ...prev, [message.id]: true }));
        };
        
        // Subscribe to events
        socket.on('incoming-message', messageHandler);
        socket.on('message-read', messageReadHandler);
        
        // Cleanup function
        return () => {
            // Safely leave the room
            if (socket && socket.connected) {
                safeEmit('leave-room', roomKey);
            }
            // Remove event listeners
            if (socket) {
                socket.off('incoming-message', messageHandler);
                socket.off('message-read', messageReadHandler);
            }
        };
    }, [chatRoom]);

    // Clean up socket connection when component unmounts
    useEffect(() => {
        return () => {
            // This will only run when the entire conversation component unmounts
            // cleanupSocketConnection(); // Don't fully cleanup on unmount as other components may use sockets
        };
    }, []);

    useEffect(() => {
        if (scrollDownRef.current) {
            scrollDownRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const isNewDay = (message: Message, index: number) => {
        if (index === 0) return true;
        const prevMessage = messages[index - 1];
        const currentMessage = message;
        const prevDate = new Date(prevMessage.createdAt);
        const currentDate = new Date(currentMessage.createdAt);
        return (
            prevDate.getUTCFullYear() !== currentDate.getUTCFullYear() ||
            prevDate.getUTCMonth() !== currentDate.getUTCMonth() ||
            prevDate.getUTCDate() !== currentDate.getUTCDate()
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <WaterDropletLoader />
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex justify-center items-center h-full text-gray-500">
                No messages available
            </div>
        );
    }

    return (
        <div
            className="w-full h-full mb-44 pb-4 px-4 overflow-y-scroll overflow-x-clip flex flex-col border-t-1"
            id="messages"
            key={chatPartner}
        >
            {messages.map((message, index) => {
                const isCurrentUser = chatPartner !== message.senderId;
                const messageDate = new Date(message.createdAt);
                const month = messageDate.getUTCMonth() + 1;
                const day = messageDate.getUTCDate();
                const year = messageDate.getUTCFullYear();
                const isMessageRead = userReadStatus[message.id] || false;

                return (
                    <div key={message.id} className="w-full">
                        {isNewDay(message, index) && (
                            <div className="date-separator">
                                <span className="date-separator-text">
                                    {`${day}/${month}/${year}`}
                                </span>
                            </div>
                        )}

                        <div
                            className={`flex flex-col ${
                                isCurrentUser ? "items-end" : "items-start"
                            } max-w-full`}
                        >
                            <div
                                className={`message-bubble ${
                                    isCurrentUser
                                        ? "message-bubble-sent"
                                        : "message-bubble-received"
                                }`}
                            >
                                {parse(message.text)}
                            </div>
                            <div
                                className={`message-timestamp ${
                                    isCurrentUser ? "text-right" : "text-left"
                                }`}
                            >
                                {new Date(message.createdAt).toLocaleTimeString(
                                    "en-US",
                                    {
                                        hour: "numeric",
                                        minute: "numeric",
                                    }
                                )}
                                {isCurrentUser && (
                                    <span className="read-status">
                                        {isMessageRead ? (
                                            <span className="read-status-check">
                                                ✓✓
                                            </span>
                                        ) : (
                                            <span className="read-status-check">
                                                ✓
                                            </span>
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={scrollDownRef} />
        </div>
    );
}