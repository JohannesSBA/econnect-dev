"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { pusherClient } from "@/app/lib/pusher";
import { toPusherKey, chatHrefConstructor } from "@/app/lib/utils";
import { toast } from "sonner";

import { User } from "@/app/types/db";
import { Message } from "@/app/lib/validation";
import NotificationToast from "../visualComponents/NotificationToast";

interface UserContextType {
    userInfo: any;
    setUserInfo: React.Dispatch<React.SetStateAction<any>>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: any) => {
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.post("/api/user/get", {});
                if (res.status === 200) {
                    const data = await res.data;
                    setUserInfo(data);
                } else {
                    console.error("Error fetching user data:", res.statusText);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUserInfo(null); // Optionally handle the state
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const router = useRouter();
    const pathName = usePathname();

    useEffect(() => {
        if (!userInfo?.id) return;

        pusherClient.subscribe(toPusherKey(`user:${userInfo.id}:chats`));

        const chatHandler = (message: Message) => {
            const shouldNotify =
                pathName !==
                `/dashboard/chat/${chatHrefConstructor(
                    userInfo.id,
                    message.senderId
                )}`;
            if (!shouldNotify) return;
            toast.custom(() => {
                return (
                    <NotificationToast
                        sessionId={userInfo.id as string}
                        senderId={message.senderId}
                        senderImg={message.image}
                        senderName={message.id}
                        senderMessage={message.text}
                    />
                );
            });
        };

        pusherClient.bind("new_message", chatHandler);

        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${userInfo.id}:chats`));
            pusherClient.unbind("new_message", chatHandler);
        };
    }, [userInfo?.id, router, pathName]);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
