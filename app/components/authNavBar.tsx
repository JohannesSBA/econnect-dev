import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";

export default async function App() {
  const session = await getServerSession(options);

  return (
    <Navbar position="sticky" className="bg-slate-400">
      <NavbarBrand className="flex gap-4">
        {/* <IconContext
          value={{
            className: "global-class-name hidden md:flex",
            size: "2em",
          }}
        >
          <GiWaterDrop />
        </IconContext> */}
        <p className="font-bold text-inherit">Econnect</p>
        {/* <p>{status}</p> */}
      </NavbarBrand>
      <NavbarContent
        className="hidden sm:flex gap-8"
        justify="center"
      ></NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <div>{session?.user.name}</div>
        </NavbarItem>
        <NavbarItem>
          <div>{session?.user.image}</div>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
