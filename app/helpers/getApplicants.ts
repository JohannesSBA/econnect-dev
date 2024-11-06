import prisma from "../lib/prisma";
import { User } from "../types/db";

export const getApplicants = async (id: string) => {
  try {
    const listing = await prisma.jobListing.findMany({
      where: {
        id: id,
      },
      select: {
        applicant: {
          select: {
            id: true,
            computerScreened: true,
            humanScreened: true,
            hired: true,
            coverLetter: true,
            resume: true,
            createdAt: true,
            updatedAt: true,
            infromation: true,
            job: true,
            user: {
              select: {
                bio: true,
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                title: true,
                createdAt: true,
                updatedAt: true,
                location: true,
                pronouns: true,
              },
            },
            jobId: true,
            status: true,
            userId: true,
          },
        },
      },
    });

    return {
      listingData: listing,
    };
  } catch (error) {
    // Handle the error, log it, or return a meaningful error response.
    console.error("Error in GetApplicants:", error);
    return { error: "Unable to retrieve user bio" };
  }
};
