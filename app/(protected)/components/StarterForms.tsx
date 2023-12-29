"use client";

import { Button, Pagination } from "@nextui-org/react";
import React from "react";
import ProfileImage from "./ProfileImage";
import Search from "./Search";

const StarterForms = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  return (
    <div className="h-full w-full">
      <span className=" w-full flex justify-center">
        {(() => {
          switch (currentPage) {
            case 1:
              return <div className="w-96 h-96 bg-red-400"></div>;
            case 2:
            case 3:
            case 4:
              return (
                <div className="w-96 h-96">
                  <ProfileImage image={"/user-avatar.png"} />
                </div>
              );
            default:
              return;
          }
        })()}
      </span>
      <div className="fixed bottom-2 w-screen flex flex-col items-center">
        <Pagination
          total={4}
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
              setCurrentPage((prev) => (prev < 4 ? prev + 1 : prev))
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
