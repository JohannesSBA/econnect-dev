"use client"; // Mark this as a client component

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Friend, User } from "@/app/types/db"; // Adjust the import path as necessary
import { chatHrefConstructor } from "@/app/lib/utils";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Badge,
} from "@nextui-org/react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import RequestHandler from "../../components/functionComponents/RequestHandler";
import { FaUserFriends } from "react-icons/fa";
import SideInfo from "../../components/visualComponents/SideInfo";
import FindPeople from "../../components/visualComponents/FindPeople";

interface ClientComponentProps {
  user: any;
  sessionId: string;
}

const ClientComponent: React.FC<ClientComponentProps> = ({
  user,
  sessionId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [requestCounter, setRequestCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const connections = user.friends ?? [];
  const filteredConnections = connections.filter(
    (connection: { firstName: any; lastName: any }) =>
      `${connection.firstName} ${connection.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const sortedConnections = filteredConnections.sort(
    (
      a: { createdAt: string | number | Date; lastName: any },
      b: { createdAt: string | number | Date; lastName: any }
    ) => {
      if (sortOption === "recent") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (sortOption === "lastName") {
        return (a.lastName ?? "").localeCompare(b.lastName ?? "");
      }
      return 0;
    }
  );

  const handleOpenModal = (connection: any) => {
    setSelectedFriend(connection);
    onOpen();
  };

  const removeFriend = async (friendId: string, email: string) => {
    try {
      const res = await axios.post("/api/friends/unfriend", {
        friendId: friendId,
        email: email,
      });
      if (res.status === 200) {
        toast.success("Friend removed successfully");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to remove friend, Please try again later");
    }
  };

  useEffect(() => {
    const friendRequestCounter = async () => {
      const getPending = await axios.post("/api/friends/requests", {});

      setRequestCounter(getPending.data[0].pendingFriendRequest.length);
      setIsLoading(false);
    };

    friendRequestCounter();
  }, [user.id]);

  let requestElement;

  requestCounter > 0
    ? (requestElement = (
        <Badge content={requestCounter} color="primary">
          <Link
            href="/chat/friend-requests"
            className="flex text-slate-800 rounded-md p-2 gap-2 items-center"
          >
            <FaUserFriends />
            <p className=" text-md">Requests</p>
          </Link>
        </Badge>
      ))
    : (requestElement = (
        <Link
          href="/chat/friend-requests"
          className="flex text-slate-800 rounded-md p-2 gap-2 items-center"
        >
          <FaUserFriends />
          <p className=" text-md">Requests</p>
        </Link>
      ));

  return (
    <div className="w-screen md:min-h-screen overflow-scroll bg-slate-100 flex flex-col md:flex-row justify-between font-PlusJakartSans p-4 gap-2">
      <div className="h-[90%] md:w-3/4 flex flex-col p-5 pl-12 bg-white">
        <div className=" text-black ">
          <div className="w-full flex justify-between">
            <h1 className="text-bold text-2xl text-slate-700">
              {connections.length} Connections
            </h1>
            <div className="group hover:bg-slate-200 p-4 bottom-0 rounded-md">
              {requestElement}
            </div>
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 mt-2 mb-4 border rounded bg-slate-100 shadow-sm"
          />

          {/* Sort Options */}
          <div className="flex gap-4 mb-4">
            <h1 className="text-slate-400 text-sm p-4">Sorted by</h1>
            <button
              className={`p-2 ${sortOption === "recent" ? "font-bold" : ""}`}
              onClick={() => setSortOption("recent")}
            >
              Recent
            </button>
            <button
              className={`p-2 ${sortOption === "lastName" ? "font-bold" : ""}`}
              onClick={() => setSortOption("lastName")}
            >
              Last Name
            </button>
          </div>

          {/* Render sorted connections */}
          {sortedConnections.map(
            (connection: {
              id: React.Key | null | undefined;
              firstName: string;
              lastName: string;
              email: string;
            }) => (
              <div
                className="flex p-6 flex-col md:flex-row gap-2 justify-between border shadow-sm mb-4"
                key={connection.id}
              >
                <div className="flex flex-col md:flex-col">
                  <div className="">
                    <Image
                      src={`https://econnectbucket.s3.amazonaws.com/image/${connection.id}`}
                      alt="Application Image"
                      width={50}
                      height={50}
                      className="rounded-full"
                    />

                    <div className="flex flex-col">
                      <p className="text-sm md:text-lg font-semibold">
                        {connection.firstName + " " + connection.lastName}
                      </p>
                      <p className="text-xs md:text-sm text-slate-400">
                        {connection.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-2 justify-center items-center scale-75 md:scale-100">
                  <Button
                    color="primary"
                    as={Link}
                    href={`/chat/${chatHrefConstructor(
                      connection.id as string,
                      sessionId
                    )}`}
                  >
                    Message
                  </Button>
                  <Button
                    color="default"
                    href={`/ec/${connection.id}`}
                    as={Link}
                  >
                    Profile
                  </Button>
                  <Button
                    onPress={() => handleOpenModal(connection)}
                    color="danger"
                  >
                    Unfriend
                  </Button>
                  <Modal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    backdrop="blur"
                    className="light"
                  >
                    <ModalContent>
                      {(onClose) => (
                        <>
                          <ModalHeader className="flex flex-col gap-1 text-black ">
                            Are You Sure?
                          </ModalHeader>
                          <ModalBody>
                            <p className="text-black">
                              This action cannot be undone! Are you sure you
                              want to remove {selectedFriend?.firstName} from
                              your friends list?
                            </p>
                          </ModalBody>
                          <ModalFooter>
                            <Button
                              color="default"
                              variant="light"
                              className="z-50"
                              onPress={onClose}
                            >
                              Close
                            </Button>
                            <Button
                              color="danger"
                              className="z-50"
                              onPress={() =>
                                removeFriend(
                                  selectedFriend?.id as string,
                                  selectedFriend?.email
                                )
                              }
                            >
                              Confirm
                            </Button>
                          </ModalFooter>
                        </>
                      )}
                    </ModalContent>
                  </Modal>
                </div>
              </div>
            )
          )}
        </div>
        <div>
          <FindPeople />
        </div>
      </div>
      <div className="w-1/4 h-[90%] md:flex hidden">
        <SideInfo
          user={user}
          posts={user.posts}
          applications={user.applications}
        ></SideInfo>
      </div>
    </div>
  );
};

export default ClientComponent;
