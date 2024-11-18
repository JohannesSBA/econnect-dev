import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import Search from "../components/SearchComponents/Search";
import SignOutButton from "../components/functionComponents/SignOutButton";
import axios from "axios";
import ProtectedNav from "../components/visualComponents/ProtectedNav";
import { getUserContent } from "@/app/helpers/getUser";
import { Friend } from "@/app/types/db";

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
        <div className="h-screen w-screen overflow-scroll font-PlusJakartaSans">
          <ProtectedNav
            userInfoId={userInfo.id as string}
            userName={userInfo.firstName + " " + userInfo.lastName}
            userEmail={userInfo.email as string}
          />
          <aside>{children}</aside>
          <div className="fixed bottom-0 right-0 p-8 flex flex-col gap-5"></div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
