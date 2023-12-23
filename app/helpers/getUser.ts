import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import prisma from "../lib/prisma";
import User from "@/app/types/db";

export const getUserContent = async (id: string) => {
  try {
    const session = await getServerSession(options);
    const userId = session?.user.id as string;

    const user = await prisma.user.findUnique({
      where: {
        id: id === "" ? userId : (id as string),
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      bio: user.bio as string,
      id: user.id as string,
      firstName: user.firstName as string,
      lastName: user.lastName as string,
      fullName: user.firstName + " " + user.lastName,
      email: user.email,
      pronouns: user.pronouns as string,
      location: user.location as string,
      education: user.education as string,
      currentPosition: user.currentPosition as string,
      title: user.title as string,
      image: user.image as string,
    };
  } catch (error) {
    // Handle the error, log it, or return a meaningful error response.
    console.error("Error in getUserBio:", error);
    return { error: "Unable to retrieve user bio" };
  }
};
