"use client";
// import { Link } from "@nextui-org/react";
// import React from "react";
// import { GiWaterDrop } from "react-icons/gi";
import SignOutButton from "../SignOutButton";
import UserPicture from "../UserPicture";
import Search from "../Search";

// const PNav = () => {
//   return (
//     <div className="sticky bg-zinc-100 h-20 w-screen flex items-center px-6 gap-4 rounded-md shadow-lg backdrop-blur-md">
//       <div className="flex gap-4">
//         <Link href={"/employer-dashboard"} className="flex gap-4 text-blue-800">
//           <GiWaterDrop />
//           <p className="hidden md:flex font-bold text-inherit">Econnect</p>
//         </Link>
//         <Link
//           href="/dashboard"
//           className="rounded-lg p-2 px-4 font-semibold text-[#6C6C6C]"
//         >
//           Dashboard
//         </Link>
//         <Link
//           href="/chat"
//           className="rounded-lg p-2 px-4 font-semibold text-[#6C6C6C]"
//         >
//           Messages
//         </Link>
//         <Link
//           href="/listings"
//           className="rounded-lg p-2 px-4 font-semibold text-[#6C6C6C]"
//         >
//           Listings
//         </Link>
//       </div>
//       <div className="w-5/6 hidden md:flex gap-3 justify-end">
//         <Search />
//         {/* <UserPicture /> */}
//         <SignOutButton />
//       </div>
//     </div>
//   );
// };

// export default PNav;

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

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    ["Profile", "/dashboard/profile"],
    ["Dashboard", "/dashboard"],
    ["My Settings", "/dashboard/settings"],
    ["Help & Feedback", "/help"],
  ];

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className="sticky bg-zinc-100 h-20 w-screen flex items-center px-6 gap-4 rounded-md shadow-lg backdrop-blur-md justify-between"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-black"
        />
        <NavbarContent className="flex gap-2" justify="start">
          <Link
            href={"/employer-dashboard"}
            className="flex gap-4 text-blue-800"
          >
            <GiWaterDrop />
            <p className="flex font-bold text-inherit">Econnect</p>
          </Link>
        </NavbarContent>
        <NavbarContent className=" hidden sm:flex gap-2" justify="start">
          <Link
            href="/dashboard"
            className="rounded-lg p-2 px-4 font-semibold text-[#6C6C6C]"
          >
            Dashboard
          </Link>
          <Link
            href="/chat"
            className="rounded-lg p-2 px-4 font-semibold text-[#6C6C6C]"
          >
            Messages
          </Link>
          <Link
            href="/listings"
            className="rounded-lg p-2 px-4 font-semibold text-[#6C6C6C]"
          >
            Listings
          </Link>
        </NavbarContent>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4">
        <NavbarItem>
          <Search />
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="justify-end gap-2 fixed right-4">
        <NavbarItem className="hidden md:flex">
          <UserPicture />
        </NavbarItem>
        <NavbarItem className="flex ">
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
