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
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import axios from "axios";
import { BioProps } from "@/app/types/db";

export default function App({ userBio }: BioProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [bio, setBio] = useState<string>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("hellp");

    const session = await getServerSession(options);

    if (!session) {
      // Handle the case where the user is not authenticated
      return;
    }

    const email = session.user.email as string;

    try {
      const res = await axios.put(
        "/api/user/bio",
        {
          email: email,
          bio: bio,
        },
        {
          headers: {
            Authorization: process.env.NEXTAUTH_SECRET as string,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status) {
        const data = res.data;
        // Handle the response data as needed
      } else {
        toast(res.data);
      }
    } catch (error) {
      // Handle any error that may occur during the API request
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
