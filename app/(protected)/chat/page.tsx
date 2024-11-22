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
import { IoChatbox } from "react-icons/io5";

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
      <div className="w-screen h-full overflow-clip flex justify-between bg-gradient-to-br from-white to-blue-100">
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
        <div className="w-full md:w-3/5 flex translate-x-24 p-4">
          <div className="hidden md:flex w-auto text-black p-4 justify-center items-center">
            <div className="text-bold text-2xl flex flex-col items-center justify-center gap-4 -translate-x-96 scale-50 md:scale-100 md:-translate-x-24">
              <div className="rounded-full p-4 border-2 border-black">
                <IoChatbox className="scale-150" />
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <h1>Your Messages</h1>
                <p className="text-medium text-slate-600">
                  Select a User to start Chatting
                </p>
              </div>
            </div>
          </div>
          <div className="hidden shadow-md rounded-md translate-x-24 m-2 p-2 md:flex flex-col gap-3 items-center justify-between ">
            {userInfo.role === "EMPLOYEE" ? (
              <SideInfo
                user={userInfo}
                posts={userInfo.posts}
                applications={userInfo.applicant}
              />
            ) : (
              <Messages
                userId={session?.user.id as string}
                friends={friendsList}
                role={userInfo.role ?? ""}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
