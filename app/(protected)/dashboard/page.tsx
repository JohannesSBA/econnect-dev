import { options } from "@/app/api/auth/[...nextauth]/options";
import SignOutButton from "@/app/components/SignOutButton";
import { getServerSession } from "next-auth";
import React from "react";
import NavBar from "@/app/components/authNavBar";

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
