import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    const token = req.headers.get("Authorization");
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }
    const authToken = token.split(" ")[1];
    const decoded = jwt.verify(
      authToken,
      process.env.NEXTAUTH_SECRET as string
    );
    if (!decoded && (!session || !session.user)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let { userId } = decoded as { userId: string };

    if (!userId) {
      userId = session?.user.id as string;
    }

    // Fetch the user's information and their friends
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        friends: { select: { id: true } },
        location: true,
        currentPosition: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const friendIds = user.friends.map((friend) => friend.id);

    // Fetch friends of friends
    const friendsOfFriends = await prisma.user.findMany({
      where: {
        AND: [
          { id: { in: friendIds } },
          { friends: { some: { id: { not: userId } } } },
        ],
      },
      select: {
        friends: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            title: true,
            email: true,
            role: true,
            location: true,
            currentPosition: true,
          },
        },
      },
    });

    // Fetch users who applied to the same jobs but are not already friends
    const userApplications = await prisma.applicant.findMany({
      where: { userId },
      select: { jobId: true },
    });

    const jobIds = userApplications.map((app) => app.jobId);

    const coApplicants = await prisma.applicant.findMany({
      where: {
        jobId: { in: jobIds },
        userId: { notIn: [userId, ...friendIds] },
      },
      select: {
        userId: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            title: true,
            email: true,
            role: true,
            location: true,
            currentPosition: true,
          },
        },
      },
    });

    // Fetch users with the same location or similar roles
    const locationAndRoleMatches = await prisma.user.findMany({
      where: {
        AND: [
          { id: { notIn: [userId, ...friendIds] } },
          {
            OR: [
              { location: user.location },
              { currentPosition: user.currentPosition },
            ],
          },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        title: true,
        email: true,
        role: true,
        location: true,
        currentPosition: true,
      },
    });

    // Combine suggestions from all sources
    const allSuggestions = [
      ...friendsOfFriends.flatMap((friend) =>
        friend.friends.filter(
          (f) => !friendIds.includes(f.id) && f.id !== userId
        )
      ),
      ...coApplicants.map((app) => app.user),
      ...locationAndRoleMatches,
    ];

    // Remove duplicates
    const uniqueSuggestions = Array.from(
      new Map(
        allSuggestions.map((suggestion) => [suggestion.id, suggestion])
      ).values()
    );

    // Filter out employers and limit the results
    const limitedSuggestions = uniqueSuggestions
      .filter((suggestion) => suggestion.role !== "EMPLOYER")
      .slice(0, 10);

    // Fallback: If no suggestions are found, fetch 4 random users
    if (limitedSuggestions.length === 0) {
      const randomUsers = await prisma.user.findMany({
        where: {
          id: { not: userId },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          title: true,
          email: true,
          role: true,
        },
        take: 4,
        orderBy: { createdAt: "desc" }, // Order by latest users as a heuristic
      });

      return NextResponse.json(randomUsers);
    }

    console.log("limitedSuggestions", limitedSuggestions);

    return NextResponse.json(limitedSuggestions);
  } catch (error) {
    console.error("Error fetching suggested friends:", error);
    return new NextResponse("Error fetching suggested friends", {
      status: 500,
    });
  }
}
