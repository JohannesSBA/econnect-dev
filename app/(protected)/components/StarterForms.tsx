"use client";

import { Button, Pagination } from "@nextui-org/react";
import React, { useEffect } from "react";
import ProfileImage from "./ProfileImage";
import Search from "./Search";
import EditContent from "./EditContent";
import { User } from "@/app/types/db";
import axios from "axios";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect, useRouter } from "next/navigation";

interface starterProps {
  user: User;
}

const StarterForms = ({ user }: starterProps) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const router = useRouter();

  async function finish() {
    const res = await axios.post("/api/user/started", {
      id: user.id,
    });
    router.push("/dashboard");
  }

  return (
    <div className="h-full w-full flex flex-col justify-between py-12">
      <span className=" w-full flex justify-center">
        {(() => {
          switch (currentPage) {
            case 1:
              return (
                <div className="">
                  <ProfileImage />
                  <h1 className="font-medium mx-24 text-center">
                    Welcome to our platform! We invite you to enhance your
                    experience by uploading a picture. We recommend professional
                    headshot, or a favorite snapshot, your profile picture adds
                    character and authenticity to your online presence.
                  </h1>
                </div>
              );
            case 2:
              return (
                <div className="w-96 h-96 mt-12 flex flex-col justify-center items-center">
                  <h1 className="font-semibold text-center">
                    This is where You get to Talk about who you are as a person.
                    Fill out the Click on the Edit Content button and Fill out
                    the required information for people to understand you
                  </h1>
                  <EditContent
                    userBio={user.bio as string}
                    userName={user.firstName as string}
                    userPronouns={user.pronouns}
                    userLocation={user.location as string}
                    userEducation={""}
                    userCPosition={""}
                    userTitle={user.title as string}
                  />
                  <Button
                    color="primary"
                    onClick={() => {
                      finish();
                    }}
                  >
                    Finish
                  </Button>
                </div>
              );
            default:
              return;
          }
        })()}
      </span>
      <div className="flex flex-col gap-2 items-center">
        <Pagination
          total={2}
          color="primary"
          page={currentPage}
          onChange={setCurrentPage}
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="flat"
            color="primary"
            onPress={() =>
              setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
            }
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="flat"
            color="primary"
            onPress={() =>
              setCurrentPage((prev) => (prev < 3 ? prev + 1 : prev))
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StarterForms;
