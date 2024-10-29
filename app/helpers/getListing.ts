import prisma from "../lib/prisma";

export const getListing = async (jobId: string) => {
    const listing = await prisma.jobListing.findUnique({
        where: {
            id: jobId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            jobType: true,
            location: true,
            shortDescription: true,
            Expired: true,
            expireDate: true,
            applicants: true,
            postedById: true,
            postedBy: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    location: true,
                    title: true,
                    likes: true,
                },
            },
        },
    });
    return listing;
};
