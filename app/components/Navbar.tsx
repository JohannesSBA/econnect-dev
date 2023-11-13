import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  button,
} from "@nextui-org/react";
import { GiWaterDrop } from "react-icons/gi";
import { IconContext } from "react-icons";
import { getServerSession } from "next-auth/next";
import { options } from "../api/auth/[...nextauth]/options";
import SignOutButton from "../(protected)/components/SignOutButton";
// import Login from "./Login";

const Header: React.FC = async () => {
  const session = await getServerSession(options);
  return (
    <Navbar position="sticky">
      <NavbarBrand className="flex gap-4">
        <GiWaterDrop />
        <p className="font-bold text-inherit">Econnect</p>
        {/* <p>{status}</p> */}
      </NavbarBrand>
      <NavbarContent justify="end">
        {!session ? (
          <button>
            <Link href="/login"></Link>
          </button>
        ) : (
          <SignOutButton />
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
