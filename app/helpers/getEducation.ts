import prisma from "@/app/lib/prisma";

export const getEducation = async (id: string) => {
  try {
    const education = await prisma.education.findMany({
      where: {
        userId: id,
      },
      select: {
        school: true,
        degree: true,
        GPA: true,
        major: true,
        startDate: true,
        endDate: true,
        description: true,
      },
    });

    return education;
  } catch (error) {
    // Handle the error, log it, or return a meaningful error response.
    console.error("Error in getEducation:", error);
    return { error: "Unable to get user education" };
  }
};
