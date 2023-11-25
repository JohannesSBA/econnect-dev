import React from "react";
import { User, Link } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export default async function App() {
  const session = await getServerSession(options);

  return (
    <div className="flex items-center gap-4">
      <Link href={"/dashboard/profile"}>
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            src: session?.user.image as string,
          }}
          className="transition-transform"
          description={session?.user.email as string}
          name={session?.user.name as string}
        />
      </Link>
    </div>
  );
}
