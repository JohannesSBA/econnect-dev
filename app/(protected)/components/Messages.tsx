"use client";
import React, { FormEvent, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
  Card,
  CardHeader,
} from "@nextui-org/react";
import FriendBadge from "./FriendBadge";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import axios from "axios";
import { User } from "@/app/types/db";

export default function Messages() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get("api/friends/get");
        setFriends(res.data[0].friends);
        console.log("from res data", res.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setError("Error fetching friends. Please try again.");
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  console.log("from friends", friends);

  return (
    <>
      <Button onPress={onOpen} color="primary" variant="solid">
        Messages
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top"
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black">
                Messages
              </ModalHeader>
              <ModalBody>
                {friends.map(
                  (friend: {
                    id: React.Key | null | undefined;
                    firstName: string;
                    lastName: string;
                    image: string;
                  }) => (
                    <div key={friend.id} className="w-full p-4 ">
                      <FriendBadge
                        firstName={friend.firstName}
                        lastName={friend.lastName}
                        pic={friend.image}
                      />
                    </div>
                  )
                )}
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
