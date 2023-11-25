import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  button,
  Avatar,
} from "@nextui-org/react";
import { GiWaterDrop } from "react-icons/gi";
import { IconContext } from "react-icons";
import { getServerSession } from "next-auth/next";
import { options } from "../../api/auth/[...nextauth]/options";
import SignOutButton from "./SignOutButton";
import UserPicture from "./UserPicture";
import Search from "./Search";
// import Login from "./Login";

const Header: React.FC = async () => {
  const session = await getServerSession(options);

  return (
    <Navbar position="sticky" className="bg-zinc-100">
      <NavbarBrand className="flex gap-2">
        <Link href={"/dashboard"} className="flex gap-4 text-blue-800">
          <GiWaterDrop />
          <p className="font-bold text-inherit">Econnect</p>
        </Link>
        <Search />
      </NavbarBrand>
      <NavbarContent justify="end">
        {!session ? (
          <button>
            <Link href="/login"></Link>
          </button>
        ) : (
          <>
            <UserPicture />
            <SignOutButton />
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
