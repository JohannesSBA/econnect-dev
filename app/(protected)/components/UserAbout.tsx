"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";
interface bioProps {
  userBio: string;
}

export default function UserAbout({ userBio }: bioProps) {
  const [showMore, setShowMore] = useState<boolean>(false);
  // TODO : USE PUSHER TO UPDATE THE BIO AS SOON AS IT IS SUBMIT OR FORCE A REFRESH
  return (
    <div className="w-80 md:w-screen border-2 border-slate-200 rounded-md shadow-sm flex justify-center">
      <Card className="bg-transparent ml-6 p-2 flex justify-center w-4/6">
        <CardHeader className="flex border-2 font-semibold justify-between">
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
          <Button variant="light" onClick={() => setShowMore(!showMore)}>
            {showMore ? "Show Less" : "Show More"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
