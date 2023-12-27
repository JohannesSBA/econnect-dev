import React from "react";
import { User, Link } from "@nextui-org/react";
import { getUserContent } from "@/app/helpers/getUser";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export default async function App() {
  const session = await getServerSession(options);
  const userInfo = await getUserContent(session?.user.id as string);

  return (
    <div className="flex items-center gap-4">
      <Link href={"/dashboard/profile"}>
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            src: `https://econnectbucket.s3.amazonaws.com/${userInfo.id}`,
          }}
          className="transition-transform"
          description={userInfo.email}
          name={userInfo.fullName}
        />
      </Link>
    </div>
  );
}
