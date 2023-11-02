import React, { FormEvent, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
} from "@nextui-org/react";
import { BiPencil } from "react-icons/bi";
import { toast } from "sonner";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import axios from "axios";

export default function App({ userBio }: BioProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [bio, setBio] = useState<string>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const session = await getServerSession(options);
    const email = session?.user.email as string;
    const res = await axios.put("/api/user/bio", {
      email: email,
      bio: bio,
    });
    if (res.status) {
      const data = await res.data;
    } else {
      toast(res.data);
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="primary">
        <BiPencil />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black">
                Edit Bio
              </ModalHeader>
              <form onSubmit={handleSubmit}>
                <ModalBody>
                  <Textarea
                    isRequired
                    label="About"
                    labelPlacement="outside"
                    placeholder="Enter your description"
                    defaultValue={userBio as string}
                    className="w-full text-black h-full"
                    onChange={(e) => {
                      setBio(e.target.value);
                    }}
                  />
                  <div className="flex py-2 px-1 justify-between"></div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit">
                    Submit
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
