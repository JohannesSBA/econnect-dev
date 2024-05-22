import prisma from "@/app/lib/prisma";

export const getExperience = async (id: string) => {
    try {
        const experience = await prisma.experience.findMany({
            where: {
                userId: id,
            },
        });

        return experience;
    } catch (error) {
        // Handle the error, log it, or return a meaningful error response.
        console.error("Error in getExperience:", error);
        return { error: "Unable to get user experience" };
    }
};
