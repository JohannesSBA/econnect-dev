import prisma from "../lib/prisma";

export const getUserContent = async (id: string) => {
  try {
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
      gotStarted: user?.gotStarted,
      role: user?.role,
    };
  } catch (error) {
    // Handle the error, log it, or return a meaningful error response.
    console.error("Error in getUserBio:", error);
    return { error: "Unable to retrieve user bio" };
  }
};
