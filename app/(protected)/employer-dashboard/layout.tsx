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
import Search from "../components/SearchComponents/Search";
import SignOutButton from "../components/functionComponents/SignOutButton";
import axios from "axios";
import ProtectedNav from "../components/visualComponents/ProtectedNav";
import EmployerSideNav from "../components/visualComponents/EmployerSideNav";

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
        <html
            lang="en"
            className="scrollbar-thin scrollbar-webkit bg-zinc-100 h-full"
        >
            <body className={inter.className}>
                <div className="h-full w-screen flex font-PlusJakartaSans bg-zinc-100">
                    <div className="sticky top-0 left-0 h-screen">
                        <EmployerSideNav
                            userInfo={userInfo}
                            userId={session.user.id as string}
                        />
                    </div>

                    <aside className="flex-1 overflow-y-auto overflow-x-clip">
                        {children}
                    </aside>
                    <div className="fixed bottom-0 right-0 p-8 flex flex-col gap-5"></div>
                </div>
            </body>
        </html>
    );
};

export default Layout;
