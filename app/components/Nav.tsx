import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { GiWaterDrop } from "react-icons/gi";

const Nav = () => {
  const router = useRouter();

  return (
    <div className="sticky top-0 w-screen h-20 bg-transparent shadow-md backdrop-blur-lg flex justify-between items-center p-8 z-50">
      <Link href={"/home"} className="flex gap-4 text-white">
        <GiWaterDrop />
        <p className="font-bold text-inherit">Econnect</p>
      </Link>
      <Button
        color="primary"
        variant="shadow"
        onClick={() => {
          router.push("/login");
        }}
      >
        Login
      </Button>
    </div>
  );
};

export default Nav;
