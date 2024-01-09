import { ListingId } from "aws-sdk/clients/datazone";
import prisma from "../lib/prisma";

export const getListing = async (jobId: string) => {
  try {
    const listing = await prisma.jobListing.findUnique({
      where: {
        id: jobId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        postedBy: true,
        createdAt: true,
        updatedAt: true,
        jobType: true,
      },
    });
    return {
      id: listing?.id,
      title: listing?.title,
      description: listing?.description,
      location: listing?.location,
      postedBy: listing?.postedBy,
      createdAt: listing?.createdAt,
      updatedAt: listing?.updatedAt,
      jobType: listing?.jobType,
    };
  } catch (error) {
    // Handle the error, log it, or return a meaningful error response.
    console.error("Error in getUserBio:", error);
    return { error: "Unable to retrieve user bio" };
  }
};
