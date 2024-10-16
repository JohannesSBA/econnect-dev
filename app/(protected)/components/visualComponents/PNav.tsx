"use client";
import SignOutButton from "../SignOutButton";
import UserPicture from "../UserPicture";
import Search from "../SearchComponents/Search";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
import { GiWaterDrop } from "react-icons/gi";
import { IoBriefcase, IoChatbox, IoHome, IoLink } from "react-icons/io5";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    ["Profile", "/dashboard/profile"],
    ["Dashboard", "/dashboard"],
    ["Messages", "/chat"],
    ["Connections", "/dashboard/connections"],
    ["Search", "/search"],
    ["My Settings", "/dashboard/settings"],
    ["Help & Feedback", "/help"],
  ];

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className="sticky z-50 bg-zinc-100 h-16 w-screen flex items-center px-6 gap-4 rounded-md shadow-lg backdrop-blur-md justify-between"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-black"
        />
        <NavbarContent className="hidden md:flex gap-2" justify="start">
          <div className="flex justify-between w-64 h-full">
            <Link
              href={"/employer-dashboard"}
              className="flex text-blue-800 mr-3"
            >
              <GiWaterDrop />
              <p className="flex font-bold text-inherit">Econnect</p>
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg p-2 px-4 justify-center h-16   font-semibold hover:text-black text-[#6C6C6C]"
            >
              <div className="flex flex-col items-center  rounded-md">
                <IoHome />
                <h1 className="hidden md:flex text-xs">Dashboard</h1>
              </div>
            </Link>
            <Link
              className="rounded-lg p-2 px-4 justify-center h-16   font-semibold hover:text-black text-[#6C6C6C]"
              href="/chat"
            >
              <div className="flex flex-col items-center  rounded-md">
                <IoChatbox />
                <h1 className="hidden md:flex text-xs">Messeging</h1>
              </div>
            </Link>
            <Link
              href="/listings"
              className="rounded-lg p-2 px-4 justify-center h-16   font-semibold hover:text-black text-[#6C6C6C]"
            >
              <div className="flex flex-col items-center rounded-md">
                <IoBriefcase />
                <h1 className="hidden md:flex text-xs">Listings</h1>
              </div>
            </Link>
            <Link
              href="/dashboard/connections"
              className="rounded-lg p-2 px-4 w-20 justify-center h-16 hover:text-black font-semibold text-[#6C6C6C]"
            >
              <div className="flex flex-col items-center  rounded-md">
                <IoLink />
                <h1 className="hidden md:flex text-xs">Connects</h1>
              </div>
            </Link>
          </div>
        </NavbarContent>
      </NavbarContent>
      <NavbarContent className="justify-end gap-2 fixed right-4">
        <NavbarItem className="hidden lg:flex gap-2">
          <Search />
          <UserPicture />
        </NavbarItem>
        <NavbarItem className="flex px-2">
          <SignOutButton />
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu className="pt-6">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "secondary"
                  : "foreground"
              }
              className="w-full"
              href={item[1]}
              size="lg"
            >
              {item[0]}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
