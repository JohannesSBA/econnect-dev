import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import prisma from "../lib/prisma";
import User from "@/app/types/db";

export const getUserContent = async (id: string) => {
  try {
    const session = await getServerSession(options);
    let userId = id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return {
      bio: user?.bio as string,
      id: user?.id as string,
      firstName: user?.firstName as string,
      lastName: user?.lastName as string,
      fullName: user?.firstName + " " + user?.lastName,
      email: user?.email,
      pronouns: user?.pronouns as string,
      location: user?.location as string,
      education: user?.education as string,
      currentPosition: user?.currentPosition as string,
      title: user?.title as string,
      image: `https://econnectbucket.s3.amazonaws.com/${user?.id}`,
    };
  } catch (error) {
    // Handle the error, log it, or return a meaningful error response.
    console.error("Error in getUserBio:", error);
    return { error: "Unable to retrieve user bio" };
  }
};
