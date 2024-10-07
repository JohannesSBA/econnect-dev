import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { GiWaterDrop } from "react-icons/gi";

interface NavProps {
  lang: string;
}

const Nav = ({ lang }: NavProps) => {
  const router = useRouter();

  return (
    <div className="sticky top-0 w-screen h-20 bg-transparent shadow-md backdrop-blur-lg flex justify-between items-center p-8 z-40 dark">
      <Link href={"/home"} className="flex gap-4 text-white">
        <GiWaterDrop />
        <p className="font-bold text-inherit">
          {lang === "en" ? "Econnect" : "E መገናኘት"}
        </p>
      </Link>

      <Button
        color="primary"
        variant="shadow"
        onClick={() => {
          router.push("/login");
        }}
      >
        {lang === "en" ? "Login" : "ግባ"}
      </Button>
    </div>
  );
};

export default Nav;
