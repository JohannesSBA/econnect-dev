"use effect";
import AddFriendButton from "@/app/(protected)/components/AddFriendButton";
import EditContent from "@/app/(protected)/components/EditContent";
import ProfileImage from "@/app/(protected)/components/ProfileImage";
import UserAbout from "@/app/(protected)/components/UserAbout";
import UserEducation from "@/app/(protected)/components/UserEducation";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getListing } from "@/app/helpers/getListing";
import { getUserContent } from "@/app/helpers/getUser";
import { Button, Card, Image } from "@nextui-org/react";
import axios from "axios";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const page = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(options);
  if (!session) {
    notFound();
  }
  const listing = await getListing(params.id);

  console.log(listing);

  return (
    <div className="w-screen h-screen bg-white flex ">
      <div className="absolute right-0 w-[calc(100vw-25rem)] h-[calc(100vh-5rem)] items-end bg-blue-100"></div>
    </div>
  );
};

export default page;
