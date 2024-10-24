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
        jobListingsPosted: true,
        emailVerified: true,
        posts: true,
        jobApplications: true,
        pendingFriendRequest: true,
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
      education: user?.education,
      currentPosition: user?.currentPosition as string,
      title: user?.title as string,
      image: `https://econnectbucket.s3.amazonaws.com/image/${user?.id}`,
      gotStarted: user?.gotStarted,
      role: user?.role,
      friends: user?.friends,
      jobListing: user?.jobListingsPosted,
      emailVerified: user?.emailVerified,
      posts: user?.posts,
      jobApplications: user?.jobApplications,
    };
  } catch (error) {
    // Handle the error, log it, or return a meaningful error response.
    console.error("Error Getting Content:", error);
    return { error: "Unable to retrieve user bio" };
  }
};
