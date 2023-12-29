"use client";
import { Avatar, Button } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { toast } from "sonner";

interface requestProps {
  incomingFriendRequest: any[];
  sessionEmail: string;
}

const RequestHandler = ({
  incomingFriendRequest,
  sessionEmail,
}: requestProps) => {
  const router = useRouter();

  async function rejectFriend(email: string, id: string, name: string) {
    try {
      axios.post("/api/friends/deny", { email, id });
    } catch (error) {
    } finally {
      return toast.success(
        `You have successfully removed ${name} from your requests`
      );
    }
  }

  async function acceptFriend(email: string, id: string, name: string) {
    try {
      axios.post("/api/friends/accept", { email, id });
    } catch (error) {
    } finally {
      return toast.success(`You have added ${email} as a friend`);
    }
  }

  return (
    <div className="w-full flex flex-col gap-24">
      {incomingFriendRequest.length > 0
        ? incomingFriendRequest.map(
            (pFriends: {
              id: string;
              firstName: string | null;
              lastName: string | null;
              image: string | null;
            }) => (
              <div
                key={pFriends.id as string}
                className="flex w-full justify-between h-full"
              >
                <div className="flex w-full gap-2 justify-normal">
                  <Avatar
                    radius="lg"
                    size="lg"
                    src={pFriends.image as string}
                  />
                  <h1 className="text-black flex flex-col justify-center font-bold">
                    {pFriends.firstName as string} {pFriends.lastName as string}
                  </h1>
                </div>
                <div className="rounded-full bg-white group-hover:bg-blue-600 group-hover:text-white flex">
                  <Button
                    onClick={() =>
                      acceptFriend(
                        sessionEmail,
                        pFriends.id,
                        pFriends.firstName as string
                      )
                    }
                    color="primary"
                    variant="shadow"
                    isIconOnly
                  >
                    <FaCheckCircle />
                  </Button>
                  <Button
                    onClick={() =>
                      rejectFriend(
                        sessionEmail,
                        pFriends.id,
                        pFriends.firstName as string
                      )
                    }
                    color="danger"
                    variant="light"
                    isIconOnly
                  >
                    <MdCancel />
                  </Button>
                </div>
              </div>
            )
          )
        : "You have no pending friend Requests"}
    </div>
  );
};

export default RequestHandler;
