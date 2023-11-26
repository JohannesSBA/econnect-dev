"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { userProps } from "@/app/types/db";
import EditContent from "./EditContent";

export default function UserAbout({
  userBio,
  userName,
  userPronouns,
  userLocation,
  userEducation,
  userCPosition,
  userTitle,
}: userProps) {
  const [showMore, setShowMore] = useState<boolean>(false);
  // TODO : USE PUSHER TO UPDATE THE BIO AS SOON AS IT IS SUBMIT OR FORCE A REFRESH
  return (
    <Card className="w-80 md:w-[600px] bg-transparent ml-6">
      <CardHeader className="flex border-2 font-semibold justify-between">
        <p className="text-md">About</p>
        <EditContent
          userBio={userBio}
          userName={userName}
          userPronouns={userPronouns}
          userLocation={userLocation}
          userEducation={userEducation}
          userCPosition={userCPosition}
          userTitle={userTitle}
        />
      </CardHeader>
      <CardBody
        className={showMore ? "h-full overflow-scroll" : "h-24 overflow-hidden"}
      >
        <p className="md:text-sm text-xs">{userBio}</p>
      </CardBody>
      <CardFooter className="flex justify-end">
        <Button variant="light" onClick={() => setShowMore(!showMore)}>
          {showMore ? "Show Less" : "Show More"}
        </Button>
      </CardFooter>
    </Card>
  );
}
