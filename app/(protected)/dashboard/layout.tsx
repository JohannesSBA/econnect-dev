import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Friend } from "@/app/types/db";
import { getUserContent } from "@/app/helpers/getUser";
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
    <html
      lang="en"
      className="scrollbar-thin scrollbar-webkit overflow-clip h-screen bg-zinc-100"
    >
      <body className={inter.className}>
        <div className="w-screen font-PlusJakartaSans">
          <div className="sticky top-0 w-screen z-[60]">
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
          <aside className="w-full h-full overflow-clip bg-zinc-100">
            {children}
          </aside>
          <div className="fixed bottom-0 right-0 p-8 flex flex-col gap-5"></div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
