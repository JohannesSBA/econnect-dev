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
      await axios.post("/api/friends/deny", { email, id });
      toast.success("Friend request rejected");
    } catch (error) {
      toast.error("Failed to reject friend request");
    } finally {
      router.refresh();
    }
  }

  async function acceptFriend(email: string, id: string, name: string) {
    toast.loading(`Adding ${name} as a friend`);
    try {
      await axios.post("/api/friends/accept", { email, id });
      toast.success(`${name} added as friend`);
    } catch (error) {
      toast.error("Failed to accept friend request");
    } finally {
      router.refresh();
    }
  }

  // Sort friend requests by name
  const sortedRequests = [...incomingFriendRequest].sort((a, b) => 
    (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName)
  );

  return (
    <div className="w-full text-black">
      {sortedRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedRequests.map((pFriends: {
            email: string | null;
            id: string;
            firstName: string | null;
            lastName: string | null;
            image: string | null;
          }) => (
            <div 
              key={pFriends.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    fill
                    src={`https://econnectbucket.s3.amazonaws.com/image/${pFriends.id}`}
                    alt="user profile picture"
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link href={`/ec/${pFriends.id}`} className="hover:underline">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {pFriends.firstName} {pFriends.lastName}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 truncate">
                    {pFriends.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <Button
                  onClick={() => acceptFriend(
                    sessionEmail,
                    pFriends.id,
                    pFriends.firstName as string
                  )}
                  color="primary"
                  className="flex-1"
                  startContent={<FaCheckCircle />}
                >
                  Accept
                </Button>
                <Button
                  onClick={() => rejectFriend(
                    sessionEmail,
                    pFriends.id,
                    pFriends.firstName as string
                  )}
                  color="danger"
                  variant="light"
                  className="flex-1"
                  startContent={<MdCancel />}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">You have no pending friend requests</p>
        </div>
      )}
    </div>
  );
};

export default RequestHandler;
