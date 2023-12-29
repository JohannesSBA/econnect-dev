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

interface MessageProps {
  userId: string;
}
interface Friend {
  key: React.Key | null | undefined;
  id: string;
  firstName: string;
  lastName: string;
}

export default function Messages({ userId }: MessageProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get("/api/friends/get");
        setFriends(res.data[0].friends);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    // Filter friends based on the search term
    const filtered = friends.filter((friend) =>
      `${friend.firstName} ${friend.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    setFilteredFriends(filtered);
  }, [friends, searchTerm]);

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
