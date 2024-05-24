import prisma from "../lib/prisma";

export const getListing = async (jobId: string) => {
    const listing = await prisma.jobListing.findUnique({
        where: {
            id: jobId,
        },
    });
    return listing;
};
