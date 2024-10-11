"use client";
import React, { useEffect, useState } from "react";
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

  // OverFlow Check
  const cardBodyRef = React.useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  useEffect(() => {
    if (
      cardBodyRef.current &&
      cardBodyRef.current.scrollHeight > cardBodyRef.current.clientHeight
    ) {
      setIsOverflowing(true);
    } else {
      setIsOverflowing(false);
    }
  }, [userBio]);

  return (
    <div className="w-full h-1/3 mt-2 rounded-md shadow-sm flex">
      <Card className="bg-transparent w-full ml-6 p-2 flex justify-center">
        <CardHeader className="flex font-semibold justify-between ">
          <p className="text-md">About</p>
        </CardHeader>
        <div
          ref={cardBodyRef}
          className={
            showMore ? "h-full overflow-scroll" : "h-full overflow-hidden"
          }
        >
          <CardBody className="h-full">
            <p className="md:text-sm text-xs ">{userBio}</p>
          </CardBody>
        </div>
        <CardFooter className="flex justify-end">
          {isOverflowing && (
            <Button variant="light" onPress={onOpen}>
              {showMore ? "Show Less" : "Show More"}
            </Button>
          )}
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="5xl"
            className="light"
          >
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
