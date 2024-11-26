"use client";
import React, { FormEvent, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Checkbox,
} from "@nextui-org/react";
import { FaArrowRight } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";

interface User {
  firstName: string;
  lastName: string;
  bio: string;
  title: string;
  location: string;
  email: string;
}

interface AppProps {
  user: User;
}

export default function App({ user }: AppProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [OldPassword, setOldPassword] = useState<string>("");
  const [newPasword, setNewPassword] = useState<string>("");

  async function changePass() {
    setLoading(true);

    const res = await axios.post("/api/user/change-pass", {
      OldPassword: OldPassword,
      newPasswprd: newPasword,
    });

    setLoading(false);
    if (res.status !== 200) {
      toast.error(res.data);
    }
    if (res.status === 200) {
      toast.success("Password changed successfully");
      window.location.reload();
    }
  }

  return (
    <div className="z-50 light">
      <div className="mx-9 mb-2 flex flex-col gap-2">
        Sign in & security
        <div className="p-4 shadow-md hover:cursor-pointer hover:bg-gray-200 flex items-center justify-between">
          <div>
            <h1>Change you Email Adress</h1>
            <h1 className="text-xs pl-2 text-slate-600">{user.email}</h1>
          </div>
          <FaArrowRight />
        </div>
        <div
          className="p-4 shadow-md hover:cursor-pointer hover:bg-gray-200 flex items-center justify-between"
          onClick={onOpen}
        >
          <div>
            <h1>Change you Password</h1>
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              className="light"
              placement="top-center"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      <h1 className="text-black mb-2">Change Password</h1>
                      <h1 className="text-xs text-slate-600">
                        For security reasons, you must confirm your current
                        password before changing it.
                      </h1>
                    </ModalHeader>
                    <ModalBody>
                      <Input
                        autoFocus
                        label="Current Password"
                        placeholder="Enter current password"
                        type={visible ? "text" : "password"}
                        variant="bordered"
                        className="text-black"
                        onChange={(e) => {
                          setOldPassword(e.target.value);
                        }}
                      />
                      <Input
                        label="New Password"
                        placeholder="Enter your new password"
                        type={visible ? "text" : "password"}
                        variant="bordered"
                        className="text-black"
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                        }}
                      />
                      <Checkbox
                        classNames={{
                          label: "text-small",
                        }}
                        onClick={() => setVisible(!visible)}
                      >
                        Show Password
                      </Checkbox>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="flat" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" onPress={changePass}>
                        Change Password
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
          <FaArrowRight />
        </div>
      </div>
    </div>
  );
}
