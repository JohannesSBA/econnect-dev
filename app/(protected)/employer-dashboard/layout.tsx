import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Avatar, Badge, Link } from "@nextui-org/react";
import { GiWaterDrop } from "react-icons/gi";
import prisma from "@/app/lib/prisma";
import { Friend } from "@/app/types/db";
import { getUserContent } from "@/app/helpers/getUser";
import Messages from "../components/Messages";
import UserPicture from "../components/UserPicture";
import Search from "../components/SearchComponents/Search";
import SignOutButton from "../components/SignOutButton";
import axios from "axios";
import ProtectedNav from "../components/visualComponents/ProtectedNav";

interface LayoutProps {
  children: ReactNode;
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Econnect",
  description: "Dashboard for Econnect",
};

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const session = await getServerSession(options);
  if (!session) return;

  const userInfo = await getUserContent(session.user.id);

  const userRole = userInfo.role as string;

  const friendsList = userInfo.friends as unknown as Friend[];

  return (
    <html lang="en" className="scrollbar-thin scrollbar-webkit">
      <body className={inter.className}>
        <div className="h-screen w-screen font-PlusJakartaSans bg-zinc-100">
          <div className="sticky bg-zinc-100 h-20 w-screen flex items-center px-6 gap-4 rounded-md shadow-lg backdrop-blur-md">
            <div className="flex gap-4">
              <ProtectedNav
                userInfoId={userInfo.id as string}
                userName={
                  ((userInfo.firstName as string) +
                    " " +
                    userInfo.lastName) as string
                }
                userEmail={userInfo.email as string}
              />
            </div>
            <div className="w-5/6 hidden md:flex gap-3 justify-end">
              <Search />
              <UserPicture />
              <SignOutButton />
            </div>
          </div>
          <aside>{children}</aside>
          <div className="fixed bottom-0 right-0 p-8 flex flex-col gap-5"></div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
