"use client";
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

export default function App() {
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
      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Find Jobs
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Post Jobs
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Browse Catagories
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Login />
        </NavbarItem>
        <NavbarItem>
          <SingUp />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
