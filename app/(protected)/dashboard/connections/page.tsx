import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { getServerSession } from "next-auth/next";
import React from "react";
import ClientComponent from "./ClientComponent"; // Import the client component
import { User } from "@/app/types/db";

const Page = async () => {
  const session = await getServerSession(options);
  if (!session || !session.user) {
    return <div>Redirecting...</div>; // Handle unauthenticated state
  }

  const user = await getUserContent(session.user.id);
  if (!user) {
    return <div>User not found</div>; // Handle case where user is null
  }

  if (user.role === "EMPLOYER") {
    return <div>Redirecting to employer dashboard...</div>;
  } else if (user.gotStarted === false && user.role === "EMPLOYEE") {
    return <div>Redirecting to get started...</div>;
  }

  return (
    <ClientComponent
      user={user as unknown as User}
      sessionId={session.user.id}
    />
  );
};

export default Page;
