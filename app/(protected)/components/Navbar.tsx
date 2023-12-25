import React from "react";
import { Link } from "@nextui-org/react";
import { GiWaterDrop } from "react-icons/gi";
import SignOutButton from "./SignOutButton";
import UserPicture from "./UserPicture";
import Search from "./Search";
import { FaUserFriends } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";

const Header: React.FC = () => {
  return (
    <div className="sticky bg-zinc-100 h-20 w-screen flex items-center px-6 gap-4 rounded-md shadow-lg backdrop-blur-md">
      <div className="w-1/6 flex gap-2">
        <Link href={"/dashboard"} className="flex gap-4 text-blue-800">
          <GiWaterDrop />
          <p className="hidden md:flex font-bold text-inherit">Econnect</p>
        </Link>
      </div>
      <div className="w-5/6 hidden md:flex gap-2 justify-end">
        <Search />
        <Link
          href="/dashboard/friend-requests"
          className="flex flex-col text-slate-800 rounded-md p-2 hover:bg-slate-200"
        >
          <FaUserFriends />
          <p className="font-extralight text-xs">Requests</p>
        </Link>
        <Link
          href="/dashboard/messages"
          className="flex flex-col text-slate-800 rounded-md p-2 hover:bg-slate-200 border-r-1"
        >
          <FaMessage />
          <p className="font-extralight text-xs">Messages</p>
        </Link>

        <UserPicture />
        <SignOutButton />
      </div>
    </div>
  );
};

export default Header;
