import SignOutButton from "@/app/components/SignOutButton";
import { Navbar } from "@nextui-org/react";
import React from "react";

const dashboard = () => {
    return (
        <div>
            <Navbar />
            <SignOutButton />
        </div>
    );
};

export default dashboard;
