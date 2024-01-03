"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import FriendBadge from "./FriendBadge";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { getServerSession } from "next-auth";
import { pusherClient } from "@/app/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/app/lib/utils";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Message } from "@/app/lib/validation";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { Friend } from "@/app/types/db";
import NotificationToast from "./NotificationToast";

interface MessageProps {
  userId: string;
  friends: Friend[];
}

export default function Messages({ userId, friends }: MessageProps) {
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const pathName = usePathname();

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
    console.log(userId);

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

  return (
    <div className="flex flex-col gap-2 m-4 bg-slate-100">
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
  );
}
