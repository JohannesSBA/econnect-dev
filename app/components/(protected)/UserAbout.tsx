"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";
import EditBio from "./EditBio";

export default function UserAbout({ userBio }: BioProps) {
  const [showMore, setShowMore] = useState<boolean>(false);

  return (
    <Card className="w-80 md:w-[600px] bg-transparent ml-6">
      <CardHeader className="flex border-2 font-semibold justify-between">
        <p className="text-md">About</p>
        <EditBio userBio={userBio} />
      </CardHeader>
      <CardBody
        className={showMore ? "h-full overflow-scroll" : "h-24 overflow-hidden"}
      >
        <p className="md:text-base text-xs">{userBio}</p>
      </CardBody>
      <CardFooter className="flex justify-end">
        <Button variant="light" onClick={() => setShowMore(!showMore)}>
          {showMore ? "Show Less" : "Show More"}
        </Button>
      </CardFooter>
    </Card>
  );
}
