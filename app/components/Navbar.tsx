import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import { GiWaterDrop } from "react-icons/gi";
import Login from "./Login";
import { IconContext } from "react-icons";
import SingUp from "./SingUp";
import { getServerSession } from "next-auth/next";
import { options } from "../api/auth/[...nextauth]/options";

const Header: React.FC = async () => {
  const session = await getServerSession(options);

  let right;
  if (session) {
    right = (
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Login />
        </NavbarItem>
        <NavbarItem>
          <SingUp />
        </NavbarItem>
      </NavbarContent>
    );
  } else {
    right = (
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">Logged In</NavbarItem>
        <NavbarItem>Signed In</NavbarItem>
      </NavbarContent>
    );
  }

  return (
    <Navbar position="sticky">
      <NavbarBrand className="flex gap-4">
        <IconContext.Provider
          value={{
            className: "global-class-name hidden md:flex",
            size: "2em",
          }}
        >
          <GiWaterDrop />
        </IconContext.Provider>
        <p className="font-bold text-inherit">Econnect</p>
        {/* <p>{status}</p> */}
      </NavbarBrand>
      <NavbarContent justify="end">{right}</NavbarContent>
    </Navbar>
  );
};

export default Header;
