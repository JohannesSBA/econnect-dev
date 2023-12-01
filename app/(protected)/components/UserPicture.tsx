import React from "react";
import { User, Link } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";

export default async function App() {
  const userInfo = await getUserContent();

  return (
    <div className="flex items-center gap-4">
      <Link href={"/dashboard/profile"}>
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            src: userInfo.image as string,
          }}
          className="transition-transform"
          description={userInfo.email as string}
          name={userInfo.fullName}
        />
      </Link>
    </div>
  );
}
