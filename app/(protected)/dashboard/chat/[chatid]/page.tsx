import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getPosts";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound, usePathname } from "next/navigation";

interface PageProps {
  params: {
    chatId: string;
  };
}

const page = ({ params }: PageProps) => {
  return (
    <div className="flex w-screen h-screen bg-red-500 justify-center align-middle">
      {}
    </div>
  );
};

export default page;
