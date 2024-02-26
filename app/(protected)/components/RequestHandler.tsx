"use client";
import { Avatar, Button } from "@nextui-org/react";
import axios from "axios";
import Link from "next/link";
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
    toast.loading("Removing friend request");
    try {
      axios.post("/api/friends/deny", { email, id });
    } catch (error) {
    } finally {
      toast.dismiss();
      router.refresh();
    }
  }

  async function acceptFriend(email: string, id: string, name: string) {
    toast.loading(`Adding ${name} as a friend`);
    try {
      axios.post("/api/friends/accept", { email, id });
    } catch (error) {
    } finally {
      toast.dismiss();
      router.refresh();
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
              <Link
                key={pFriends.id as string}
                className="flex w-full justify-between h-full"
                href={`/ec/${pFriends.id}`}
              >
                <div className="flex w-full gap-2 justify-normal">
                  <Avatar
                    radius="lg"
                    size="lg"
                    src={`https://econnectbucket.s3.amazonaws.com/image/${pFriends.id}`}
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
              </Link>
            )
          )
        : "You have no pending friend Requests"}
    </div>
  );
};

export default RequestHandler;
