import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import { GiWaterDrop } from 'react-icons/gi'
import Login from "./Login";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { notFound } from "next/navigation";

// async function isLoggedIn(){
//   const session = await getServerSession(options);
//   console.log(session);
// }

export default function App() {

  return (
        <Navbar
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      <NavbarBrand>
        <GiWaterDrop />

          <p className="font-bold text-inherit">Econnect</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Sign Up</Link>
        </NavbarItem>
        <NavbarItem>
            <div className="hidden md:flex">
                <Login/>
            </div>
            <div className="md:hidden flex">
                <Button as={Link} color="primary" href="#" variant="flat">
                    Login 
                </Button>
            </div>
          
        </NavbarItem>
        <NavbarItem>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    
  );
}

