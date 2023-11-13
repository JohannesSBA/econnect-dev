import React from "react";
import { Badge, Avatar } from "@nextui-org/react";
import { AiOutlineArrowRight } from "react-icons/ai";

export default function App() {
  return (
    <Badge color="primary">
      <div className="flex w-full gap-2 items-center">
        <Avatar
          radius="md"
          size="lg"
          src="https://i.pravatar.cc/300?u=a042581f4e29026709d"
        />
        <h1 className="text-black w-full flex flex-col justify-center font-bold">
          Johnnaes Bekele
        </h1>
        <div className="hover:bg-blue-600 rounded-full hover:text-white p-4 ring-2">
          <AiOutlineArrowRight />
        </div>
      </div>
    </Badge>
  );
}
