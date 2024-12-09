"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { pusherClient } from "@/app/lib/pusher";
import { toPusherKey } from "@/app/lib/utils";
import { toast } from "sonner";
import parse from "html-react-parser";
import { Spinner } from "@nextui-org/react";
import WaterDropLoader from "@/app/components/WaterDropLoader";
import WaterDropletLoader from "@/app/components/WaterDropLoader";

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

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`chat:${chatRoom}`));

        const messageHandler = (message: Message) => {
            setMessages((prev) => [...prev, message]);
            setUserReadStatus((prev) => ({ ...prev, [message.id]: false }));
        };

        const messageReadHandler = (message: Message) => {
            setUserReadStatus((prev) => ({ ...prev, [message.id]: true }));
        };

        pusherClient.bind("incoming-message", messageHandler);
        pusherClient.bind("message-read", messageReadHandler);

        return () => {
            pusherClient.unsubscribe(toPusherKey(`chat:${chatRoom}`));
            pusherClient.unbind("incoming-message", messageHandler);
            pusherClient.unbind("message-read", messageReadHandler);
        };
    }, [chatRoom]);

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
