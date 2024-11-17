"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import {
  Avatar,
  Button,
  Checkbox,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { FaBell, FaBellSlash } from "react-icons/fa6";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { on } from "events";

interface InfoDrawerProps {
  friendId: string;
  friendName: string;
}

export default function InfoDrawer({ friendId, friendName }: InfoDrawerProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  async function deleteChat() {
    try {
      await axios.post("/api/message/deleteAll", {
        friendId: friendId,
      });
      toast.success("Chat deleted successfully");
      router.push("/chat");
    } catch (error) {
      toast.error("An error occurred");
    }
  }

  async function removeFriend() {
    try {
      await axios.post("/api/friend/remove", {
        friendId: friendId,
      });
      toast.success("Friend removed successfully");
      router.push("/chat");
    } catch (error) {
      toast.error("An error occurred");
    }
  }

  return (
    <div>
      <Tooltip content="Details">
        <Button isIconOnly variant="flat" onClick={() => setOpen(true)}>
          <IoIosInformationCircleOutline className="scale-125" />
        </Button>
      </Tooltip>

      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel
                transition
                className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <TransitionChild>
                  <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="relative rounded-md text-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <span className="absolute -inset-2.5" />
                      <span className="sr-only">Close panel</span>
                      <MdCancel />
                      sdf
                    </button>
                  </div>
                </TransitionChild>
                <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <DialogTitle className="text-base font-semibold text-gray-900">
                      Details
                    </DialogTitle>
                  </div>
                  <div className="relative mt-6 flex-1 flex flex-col px-4 sm:px-6 justify-between">
                    <div>
                      <h1 className="text-xl font-bold border-b-2 pb-3">
                        Details
                      </h1>

                      <div className="p-3 flex gap-2 items-center">
                        <Avatar
                          radius="lg"
                          size="lg"
                          src={`https://econnectbucket.s3.amazonaws.com/image/${friendId}`}
                          className="flex items-center border-2"
                        />
                        <h1 className="font-bold">{friendName}</h1>
                      </div>
                    </div>
                    <div className="flex flex-col border-y-1 gap-2 ">
                      <div className="flex gap-2 p-3 border-b-2">
                        <Switch
                          defaultSelected
                          size="lg"
                          color="default"
                          startContent={<FaBell />}
                          endContent={<FaBellSlash />}
                        >
                          Mute Messages
                        </Switch>
                      </div>
                      <Button
                        className="border-b-1 p-3 bg-white text-red-500 w-full flex justify-start"
                        variant="flat"
                      >
                        Report
                      </Button>
                      <Button
                        className="p-3 bg-white text-red-500 w-full flex justify-start"
                        variant="flat"
                        onClick={() => functionModal("removeFriend")}
                      >
                        Remove Friend
                      </Button>
                      <Button
                        className="p-3 bg-white text-red-500 w-full flex justify-start"
                        variant="flat"
                        onClick={() => functionModal("deleteChat")}
                      >
                        Delete Chat
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );

  function functionModal(action: "deleteChat" | "removeFriend") {
    const modalInfo = {
      deleteChat: {
        title: "Delete Chat",
        message:
          "Are you sure you want to delete this chat? You cannot undo this action.",
        action: deleteChat,
      },
      removeFriend: {
        title: "Remove Friend",
        message:
          "Are you sure you want to remove this friend? You cannot undo this action.",
        action: removeFriend,
      },
    };

    const { title, message, action: modalAction } = modalInfo[action];

    return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>
                <div className="flex flex-col justify-center items-center text-center">
                  <h1>{message}</h1>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    modalAction();
                    onClose();
                  }}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  }
}
