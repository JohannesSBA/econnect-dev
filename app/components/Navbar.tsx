import React from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
} from "@nextui-org/react";
import { GiWaterDrop } from "react-icons/gi";
import Login from "./Login";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { notFound } from "next/navigation";

// async function isLoggedIn() {
//     const session = await getServerSession(options);
//     console.log(session);
// }

export default function App() {
    return (
        <Navbar position="static">
            <NavbarBrand>
                <GiWaterDrop />
                <p className="font-bold text-inherit">Econnect</p>
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
                    <Button as={Link} color="primary" href="#" variant="flat">
                        Sign Up
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
