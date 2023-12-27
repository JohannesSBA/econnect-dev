"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
interface bioProps {
  userBio: string;
}

export default function UserAbout({ userBio }: bioProps) {
  const [showMore, setShowMore] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // TODO : USE PUSHER TO UPDATE THE BIO AS SOON AS IT IS SUBMIT OR FORCE A REFRESH
  return (
    <div className="w-fit h-1/3 mt-2 rounded-md shadow-sm flex justify-center">
      <Card className="bg-transparent ml-6 p-2 flex justify-center">
        <CardHeader className="flex font-semibold justify-between">
          <p className="text-md">About</p>
        </CardHeader>
        <CardBody
          className={
            showMore ? "h-full overflow-scroll" : "h-24 overflow-hidden"
          }
        >
          <p className="md:text-sm text-xs">{userBio}</p>
        </CardBody>
        <CardFooter className="flex justify-end">
          <Button variant="light" onPress={onOpen}>
            {showMore ? "Show Less" : "Show More"}
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-slate-950">
                    About
                  </ModalHeader>
                  <ModalBody>
                    <p className="text-slate-950 font-xs">{userBio}</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </CardFooter>
      </Card>
    </div>
  );
}
