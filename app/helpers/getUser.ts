import prisma from "../lib/prisma";

export const getUserContent = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        bio: true,
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        pronouns: true,
        location: true,
        education: true,
        currentPosition: true,
        title: true,
        gotStarted: true,
        role: true,
        friends: true,
        frinedsOf: true,
        jobListingsPosted: true,
        emailVerified: true,
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
      image: `https://econnectbucket.s3.amazonaws.com/image/${user?.id}`,
      gotStarted: user?.gotStarted,
      role: user?.role,
      friends: user?.friends,
      friendsOf: user?.frinedsOf,
      jobListing: user?.jobListingsPosted,
      emailVerified: user?.emailVerified,
    };
  } catch (error) {
    // Handle the error, log it, or return a meaningful error response.
    console.error("Error in getUserBio:", error);
    return { error: "Unable to retrieve user bio" };
  }
};
