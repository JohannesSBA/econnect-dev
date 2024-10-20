"use client";
import { Avatar, Button } from "@nextui-org/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { toast } from "sonner";
import Image from "next/image";

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
    <div className="w-full text-black flex flex-col mt-4 items-center gap-24">
      {incomingFriendRequest.length > 0
        ? incomingFriendRequest.map(
            (pFriends: {
              email: string | null;
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
                  <Image
                    width={200}
                    height={200}
                    src={`https://econnectbucket.s3.amazonaws.com/image/${pFriends.id}`}
                    alt="user profile picture"
                  />
                  <h1 className="text-black flex flex-col justify-center font-bold">
                    {pFriends.firstName as string} {pFriends.lastName as string}
                    <p className="text-slate-500 text-xs pl-2">
                      {pFriends.email}
                    </p>
                  </h1>
                </div>
                <div className="gap-2 flex">
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
