"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Badge, Button, Input, Skeleton } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { pusherClient } from "@/app/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/app/lib/utils";
import { Message } from "@/app/lib/validation";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { Friend } from "@/app/types/db";
import Link from "next/link";
import { FaUserFriends } from "react-icons/fa";
import prisma from "@/app/lib/prisma";
import axios from "axios";
import NotificationToast from "./NotificationToast";

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
    const filtered = friends.filter((friend) =>
      `${friend.firstName} ${friend.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    setFilteredFriends(filtered);
  }, [friends, searchTerm]);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${userId}:chats`));

    const chatHandler = (message: Message) => {
      const shouldNotify =
        pathName !==
        `/dashboard/chat/${chatHrefConstructor(userId, message.senderId)}`;
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

    pusherClient.bind("new_message", chatHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${userId}:chats`));
      pusherClient.unbind("new_message", chatHandler);
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

  if (
    isLoading &&
    !pathName.includes("profile") &&
    !pathName.includes("ec") &&
    !pathName.includes("employer-dashboard")
  )
    return (
      <Skeleton className="h-[calc(100vh-10rem)] flex flex-col justify-between gap-2 m-4" />
    );

  return (
    <div
      className={
        pathName.includes("profile") ||
        pathName.includes("ec") ||
        pathName.includes("employer-dashboard")
          ? `hidden`
          : `h-full bg-white flex flex-col justify-between gap-2  border-r-1 border-slate-300 shadow-md w-screen md:w-auto`
      }
    >
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          label="Search"
          className="max-w-xs light bg-white text-black p-2"
          endContent={<FaSearch />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <h1 className="ml-5 font-extrabold text-xs">Messages</h1>
        {filteredFriends.length === 0 ? (
          <h1 className="text-black ml-3">
            &quot;{searchTerm}&quot; not Found
          </h1>
        ) : (
          filteredFriends.map(
            (friend: {
              key: React.Key | null | undefined;
              id: string;
              firstName: string;
              lastName: string;
              email: string;
            }) => (
              <div key={friend.key} className="w-full">
                <Button
                  onClick={() => {
                    router.push(
                      `/chat/${chatHrefConstructor(userId, friend.id)}`
                    );
                  }}
                  className="w-full h-fit md:p-4 justify-center md:justify-start bg-white hover:bg-slate-200 group rounded-none"
                >
                  <div className="flex w-full justify-between">
                    <div className="flex w-full gap-2 justify-normal">
                      <div className="flex items-center justify-center md:justify-normal">
                        <Avatar
                          size="lg"
                          src={`https://econnectbucket.s3.amazonaws.com/image/${friend.id}`}
                          className="flex items-center border-2 group-hover:scale-110"
                        />
                      </div>

                      <div className="text-black flex flex-col  items-center text-start font-bold sm:block">
                        <p>
                          {friend.firstName} {friend.lastName}
                        </p>
                        <p className="text-slate-700 text-xs font-extralight">
                          {friend.email}
                        </p>
                      </div>
                      <p>{}</p>
                    </div>
                  </div>
                </Button>
              </div>
            )
          )
        )}
        {}
      </div>
      {role === "EMPLOYEE" ? (
        <div className="group hover:bg-slate-200 p-4 bottom-0">
          {requestElement}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
