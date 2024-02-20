import prisma from "../lib/prisma";
import { User } from "../types/db";

export const getApplicants = async (id: string) => {
  try {
    const listing = await prisma.jobListing.findMany({
      where: {
        id: id,
      },
      select: {
        applicants: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            phoneNumber: true,
            bio: true,
            title: true,
            // Add other properties here
          },
        },
      },
    });

    return {
      applicants: listing?.[0]?.applicants,
    };
  } catch (error) {
    // Handle the error, log it, or return a meaningful error response.
    console.error("Error in GetApplicants:", error);
    return { error: "Unable to retrieve user bio" };
  }
};
