import AddFriendButton from "@/app/(protected)/components/AddFriendButton";
import EditContent from "@/app/(protected)/components/EditContent";
import ProfileImage from "@/app/(protected)/components/ProfileImage";
import UserAbout from "@/app/(protected)/components/UserAbout";
import UserEducation from "@/app/(protected)/components/UserEducation";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { Button, Card, Image } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(options);
  if (!session) {
    notFound();
  }

  return <div>{}</div>;
};

export default page;
