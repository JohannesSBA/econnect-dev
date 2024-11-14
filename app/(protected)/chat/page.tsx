import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { getServerSession } from "next-auth";
import { notFound, usePathname } from "next/navigation";
import React from "react";
import { Friend } from "@/app/types/db";
import ProtectedNav from "../components/visualComponents/ProtectedNav";
import SideInfo from "../components/visualComponents/SideInfo";
import Messages from "../components/visualComponents/Messages";
import EmployerSideNav from "../components/visualComponents/EmployerSideNav";

interface PageProps {
  params: {
    chatId: string;
  };
}

interface PageProps {
  params: {
    chatId: string;
  };
}

const page = async ({ params }: { params: { chatid: string } }) => {
  const { chatid } = params;
  console.log("chatId", chatid);
  const session = await getServerSession(options);
  if (!session) notFound();

  const userInfo = await getUserContent(session?.user.id as string);
  //   const friendContent = await getUserContent(friendId);

  const friendsList = userInfo.friends as unknown as Friend[];

  //   if (session.user.id !== userId) {
  //     notFound();
  //   }

  return (
    <div className="h-screen w-screen overflow-clip font-PlusJakartaSans flex flex-col">
      {userInfo.role === "EMPLOYEE" ? (
        <ProtectedNav
          userInfoId={userInfo.id as string}
          userName={userInfo.firstName + " " + userInfo.lastName}
          userEmail={userInfo.email as string}
        />
      ) : (
        ""
      )}
      <div className="w-screen h-full overflow-clip flex bg-slate-100">
        <div className="w-full md:w-1/5">
          {userInfo.role === "EMPLOYEE" ? (
            <Messages
              userId={session?.user.id as string}
              friends={friendsList}
              role={userInfo.role ?? ""}
            />
          ) : (
            <EmployerSideNav userInfo={userInfo} userId={session.user.id} />
          )}
        </div>
        <div className="w-full md:w-3/5 hidden md:flex translate-x-24 p-4">
          <div className="hidden md:flex w-2/3 text-black p-4">
            <h1 className="text-bold text-2xl">Start Chatting</h1>
          </div>
          <div className="hidden shadow-md rounded-md translate-x-24 m-2 p-2 md:flex flex-col gap-3 items-center justify-between ">
            <SideInfo
              user={userInfo}
              posts={userInfo.posts}
              applications={userInfo.applicant}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
