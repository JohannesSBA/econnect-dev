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
} from "@nextui-org/react";
import FriendBadge from "./FriendBadge";
import axios from "axios";

interface MessageProps {
  userId: string;
}

export default function Messages({ userId }: MessageProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get("api/friends/get");
        setFriends(res.data[0].friends);
        console.log("from res data", res.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

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
                        friendId={friend.id as string}
                        user={userId}
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
