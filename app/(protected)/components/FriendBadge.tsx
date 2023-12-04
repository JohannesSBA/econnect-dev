import React from "react";
import { Badge, Avatar } from "@nextui-org/react";
import { AiOutlineArrowRight } from "react-icons/ai";

interface avatarProps {
  firstName: string;
  lastName: string;
  pic: string;
}

export default function App({ firstName, lastName, pic }: avatarProps) {
  return (
    <Badge color="primary">
      <div className="flex w-full gap-2 items-center justify-between">
        <Avatar radius="lg" size="lg" src={pic} />
        <h1 className="text-black w-full flex flex-col justify-center font-bold">
          {firstName} {lastName}
        </h1>
        <div className="hover:bg-blue-600 rounded-full hover:text-white p-4 ring-2">
          <AiOutlineArrowRight />
        </div>
      </div>
    </Badge>
  );
}
