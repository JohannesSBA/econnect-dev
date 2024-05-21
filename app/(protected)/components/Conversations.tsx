"use client";
import axios from "axios";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { pusherClient } from "@/app/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/app/lib/utils";
import { z } from "zod";
import { messageValidator } from "@/app/lib/validation";
import { toast } from "sonner";
import parse from "html-react-parser";

interface conversationProps {
    chatPartner: string;
    chatId: string;
    chatRoom: string;
}

type Message = z.infer<typeof messageValidator>;

const Conversations: FunctionComponent<conversationProps> = ({
    chatPartner,
    chatId,
    chatRoom,
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userReadStatus, setUserReadStatus] = useState<
        Record<string, boolean>
    >({});

    // Get all Messages in the conversation
    useEffect(() => {
        const getMessage = async () => {
            try {
                const res = await axios.post("/api/message/get", {
                    chatPartner: chatPartner,
                    chatId: chatId,
                });
                const sortedMessages = res.data.sort(
                    (a: Message, b: Message) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                );
                setMessages(sortedMessages);
            } catch {
                return toast.error("Sorry, This chat isn't available.");
            }
        };

        getMessage();
    }, [chatId, chatPartner]);

    // Realtime updating of the messages
    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`chat:${chatRoom}`));

        const messageHandler = (message: Message) => {
            setMessages((prev) => [...prev, message]);
            // Assume the current user has not read the message initially
            setUserReadStatus((prev) => ({ ...prev, [message.id]: false }));
        };

        pusherClient.bind("incoming-message", messageHandler);

        return () => {
            pusherClient.unsubscribe(toPusherKey(`chat:${chatRoom}`));
            pusherClient.unbind("incoming-message", messageHandler);
        };
    }, [chatRoom]);

    const scrollDownRef = useRef<HTMLDivElement | null>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollDownRef.current) {
            scrollDownRef.current.scrollIntoView();
        }
    }, [messages]);

    return (
        <div
            className="w-full h-full px-4 overflow-scroll flex flex-col"
            id="messages"
        >
            {messages.map((message, index) => {
                const isCurrentUser = chatPartner !== message.senderId;
                const messageDate = new Date(message.createdAt);
                const month = messageDate.getUTCMonth() + 1; // months from 1-12
                const day = messageDate.getUTCDate();
                const year = messageDate.getUTCFullYear();

                const hasMessageOnNewDay = (() => {
                    if (index === 0) {
                        // The first message is always on a new day
                        return true;
                    }

                    const previousMessageDate = new Date(
                        messages[index - 1].createdAt
                    );
                    const currentMessageDate = new Date(message.createdAt);

                    // Compare the dates without considering the time
                    return (
                        previousMessageDate.getUTCFullYear() !==
                            currentMessageDate.getUTCFullYear() ||
                        previousMessageDate.getUTCMonth() !==
                            currentMessageDate.getUTCMonth() ||
                        previousMessageDate.getUTCDate() !==
                            currentMessageDate.getUTCDate()
                    );
                })();

                return (
                    <div key={message.id} className="w-full">
                        {hasMessageOnNewDay ? (
                            <div className="flex justify-center border-l-2 border-r-2 font-semibold text-xs text-slate-500 bg-slate-200">
                                {`${day}/${month}/${year}`}
                            </div>
                        ) : (
                            ""
                        )}
                        <div
                            className={
                                !isCurrentUser
                                    ? "flex justify-start my-2"
                                    : "flex justify-end my-2"
                            }
                        >
                            <div className="items-start flex gap-2.5">
                                <div className="flex flex-col gap-1 w-full max-w-[460px]">
                                    <div
                                        className={
                                            isCurrentUser
                                                ? "flex flex-col leading-1.5 p-2 border-gray-200 bg-blue-400 rounded-s-xl rounded-se-xl "
                                                : "flex flex-col leading-1.5 p-2 border-gray-200 bg-slate-200 rounded-e-xl rounded-es-xl "
                                        }
                                    >
                                        <span
                                            className={
                                                isCurrentUser
                                                    ? "py-2 rounded-lg w-full text-white"
                                                    : "py-2 rounded-lg w-full"
                                            }
                                        >
                                            {parse(message.text)}
                                        </span>
                                        <span
                                            className={
                                                isCurrentUser
                                                    ? "ml-2 text-[10px] p-1 text-gray-300 realtive right-0 w-full text-right"
                                                    : "ml-2 text-[10px] p-1 text-gray-400 realtive right-0 w-full text-right"
                                            }
                                        >
                                            {new Date(
                                                message.createdAt
                                            ).toLocaleTimeString("en-US", {
                                                hour: "numeric",
                                                minute: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            <div ref={scrollDownRef} />
        </div>
    );
};

export default Conversations;
