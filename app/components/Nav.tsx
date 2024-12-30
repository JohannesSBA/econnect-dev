"use client";
import { Button, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { GiWaterDrop } from "react-icons/gi";

interface NavProps {
  lang: string;
}

const Nav = ({ lang }: NavProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLoginClick = () => {
    setLoading(true); // Show loading indicator
    router.push("/login");
    setLoading(false); // Reset loading after navigation completes
  };

  return (
    <div className="sticky top-0 w-screen h-20  shadow-md bg-blue-900 backdrop-blur-lg flex justify-between items-center p-8 z-40 dark">
      <Link href={"/home"} className="flex gap-4 p-4 text-white">
        <GiWaterDrop />
        <p className="font-bold text-inherit">Econnect</p>
      </Link>

      <Button
        color="primary"
        variant="shadow"
        onClick={handleLoginClick}
        isLoading={loading} // Show loading spinner
        disabled={loading} // Disable button when loading
      >
        {lang === "en" ? "Login" : "ግባ"}
      </Button>
    </div>
  );
};

export default Nav;
