import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import prisma from "../lib/prisma";

export const getUserContent = async () => {
  try {
    const session = await getServerSession(options);
    const email = session?.user.email as string;

    if (!session) return;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      bio: user.bio as string,
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
      id: user.id as string,
    };
  } catch (error) {
    // Handle the error, log it, or return a meaningful error response.
    console.error("Error in getUserBio:", error);
    return { error: "Unable to retrieve user bio" };
  }
};
