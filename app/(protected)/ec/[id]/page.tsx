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
  if (session.user.id === params.id) {
    redirect("/dashboard/profile");
  }

  const userInfo = await getUserContent(params.id);
  const stringifiedFriends = JSON.stringify(userInfo.friends);

  const role = userInfo.role as string;
  let userActionButton;
  if (role === "EMPLOYER") {
    userActionButton = (
      <div>
        <Button color="primary">
          <a href={`/ec/${userInfo.id}`}></a>
          Go to Messages
        </Button>
      </div>
    );
  } else if (role === "EMPLOYEE") {
    stringifiedFriends.includes(session.user.id)
      ? (userActionButton = (
          <a href={`/chat/${userInfo.id}`}>
            <Button color="primary">Send a Message</Button>
          </a>
        ))
      : (userActionButton = <AddFriendButton id={userInfo.id as string} />);
  }

  return (
    <div className="w-screen h-screen bg-white flex">
      <div className="w-1/3 h-full ">
        <div className="h-2/5 w-full overflow-clip flex flex-col justify-center items-center">
          <ProfileImage image={userInfo.image as string} />
          {userActionButton}
        </div>
        <div className="h-3/5 w-full  flex flex-col gap-8 items-center mt-12">
          <div className="mx-4 w-5/6 h-10 bg-slate-50 rounded-md flex items-center p-8">
            <h1 className="font-bold text-2xl text-black">
              <p className="uppercase font-extralight text-xs">full name</p>
              {userInfo.fullName}
            </h1>
          </div>
          <div className="mx-4 w-5/6 h-10 bg-slate-50 rounded-md flex items-center p-8">
            <h1 className="font-bold text-2xl text-black">
              <p className="uppercase font-extralight text-xs">Pronouns</p>(
              {userInfo.pronouns})
            </h1>
          </div>
          <div className="mx-4 w-5/6 h-10 bg-slate-50 rounded-md flex items-center p-8">
            <h1 className="font-bold text-2xl text-black">
              <p className="uppercase font-extralight text-xs">
                Current Position
              </p>
              {userInfo.currentPosition}
            </h1>
          </div>

          <div className="mx-4 w-5/6 h-10 bg-slate-50 rounded-md flex items-center p-8">
            <h1 className="font-bold text-2xl text-black">
              <p className="uppercase font-extralight text-xs">Location</p>
              {userInfo.location}
            </h1>
          </div>
        </div>
      </div>
      <div className="w-1/3 h-full flex flex-col">
        <UserAbout userBio={userInfo.bio as string} />
        <UserEducation userInfo={userInfo} />
      </div>

      <div className="w-1/3 h-full flex flex-col"></div>
    </div>
  );
};

export default page;
