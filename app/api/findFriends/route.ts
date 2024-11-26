import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    // Get the user's friends
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { friends: { select: { id: true } } },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const friendIds = user.friends.map((friend) => friend.id);

    // Get friends of the user's friends
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
          },
        },
      },
    });

    const sameApps = await prisma.applicant.findMany({
      where: {
        userId: userId,
      },
      select: {
        jobId: true,
      },
    });

    const sameAppsIds = sameApps.map((app) => app.jobId);

    const appliedPeopleNotFriends = await prisma.applicant.findMany({
      where: {
        jobId: { in: sameAppsIds },
        NOT: {
          userId: { in: friendIds },
        },
      },
      select: {
        userId: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            title: true,
            email: true,
            role: true,
          },
        },
      },
    });

    friendsOfFriends.push(
      ...appliedPeopleNotFriends.map((applicant) => ({
        friends: [
          {
            id: applicant.userId,
            firstName: applicant.user.firstName,
            lastName: applicant.user.lastName,
            title: applicant.user.title,
            email: applicant.user.email,
            role: applicant.user.role,
          },
        ],
      }))
    );

    // Flatten the list of friends of friends and exclude the user's current friends and the user themselves
    const suggestedFriends = friendsOfFriends.flatMap((friend) =>
      friend.friends.filter((f) => !friendIds.includes(f.id) && f.id !== userId)
    );

    // Remove duplicates
    const uniqueSuggestedFriends = Array.from(
      new Map(suggestedFriends.map((f) => [f.id, f])).values()
    );

    // Limit to 5 suggested friends
    const notEmployers = uniqueSuggestedFriends.filter(
      (f) => f.role !== "EMPLOYER"
    );
    const limitedSuggestedFriends = notEmployers.slice(0, 4);

    console.log(limitedSuggestedFriends);

    return NextResponse.json(limitedSuggestedFriends);
  } catch (error) {
    console.error("Error fetching suggested friends:", error);
    return new NextResponse("Error fetching suggested friends", {
      status: 500,
    });
  }
}
