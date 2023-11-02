import { options } from "@/app/api/auth/[...nextauth]/options";
import SignOutButton from "@/app/components/(protected)/SignOutButton";
import NavBar from "@/app/components/(protected)/authNavBar";
import { getServerSession } from "next-auth";
import React from "react";

const page = async () => {
  const session = await getServerSession(options);
  return (
    <div>
      <NavBar />
      <h1>{session?.user.email}</h1>
      <SignOutButton />
    </div>
  );
};

export default page;
