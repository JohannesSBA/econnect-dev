"use client";
import React, { useEffect, useState } from "react";
import { Badge, Input, Skeleton } from "@nextui-org/react";
import FriendBadge from "./FriendBadge";
import { FaSearch } from "react-icons/fa";
import { pusherClient } from "@/app/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/app/lib/utils";
import { Message } from "@/app/lib/validation";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { Friend } from "@/app/types/db";
import NotificationToast from "./NotificationToast";
import Link from "next/link";
import { FaUserFriends } from "react-icons/fa";
import prisma from "@/app/lib/prisma";
import axios from "axios";

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
            href="/dashboard/friend-requests"
            className="flex text-slate-800 rounded-md p-2 gap-2 items-center"
          >
            <FaUserFriends />
            <p className=" text-md">Requests</p>
          </Link>
        </Badge>
      ))
    : (requestElement = (
        <Link
          href="/dashboard/friend-requests"
          className="flex text-slate-800 rounded-md p-2 gap-2 items-center"
        >
          <FaUserFriends />
          <p className=" text-md">Requests</p>
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

  console.log(filteredFriends);

  if (isLoading)
    return (
      <Skeleton className="h-[calc(100vh-10rem)] flex flex-col justify-between gap-2 m-4" />
    );

  return (
    <div
      className={
        pathName.includes("profile") || pathName.includes("ec")
          ? `hidden`
          : `h-[calc(100vh-10rem)] hidden md:flex flex-col justify-between gap-2 m-4 bg-slate-100`
      }
    >
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          label="Search"
          className="max-w-xs bg-slate-100"
          endContent={<FaSearch />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredFriends.map(
          (friend: {
            key: React.Key | null | undefined;
            id: string;
            firstName: string;
            lastName: string;
          }) => (
            <div key={friend.key} className="w-full">
              <FriendBadge
                firstName={friend.firstName}
                lastName={friend.lastName}
                friendId={friend.id as string}
                user={userId}
              />
            </div>
          )
        )}
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
