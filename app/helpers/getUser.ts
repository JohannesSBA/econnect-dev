import { cache } from "react";
import prisma from "../lib/prisma";

export const getUserContent = cache(async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                education: true,
                friends: true,
                Comment: true,
                experience: true,
                jobApplications: true,
                posts: true,
                notifications: true,
                JobCScreened: true,
                jobListingsPosted: true,
                likes: true,
                messagesRead: true,
                messagesSent: true,
                messagesReceived: true,
                savedPosts: true,
                pendingFriendRequest: true,
                sentFriendRequest: true,
                Report: true,
                friendsOf: true,
                JobHired: true,
                JobHScreened: true,
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
            friends: user?.friends,
            Comment: user?.Comment,
            experience: user?.experience,
            jobApplications: user?.jobApplications,
            posts: user?.posts,
            notifications: user?.notifications,
            JobCScreened: user?.JobCScreened,
            jobListingsPosted: user?.jobListingsPosted,
            likes: user?.likes,
            messagesRead: user?.messagesRead,
            messagesSent: user?.messagesSent,
            messagesReceived: user?.messagesReceived,
            savedPosts: user?.savedPosts,
            pendingFriendRequest: user?.pendingFriendRequest,
            sentFriendRequest: user?.sentFriendRequest,
            Report: user?.Report,
            friendsOf: user?.friendsOf,
            JobHired: user?.JobHired,
            JobHScreened: user?.JobHScreened,
            image: `https://econnectbucket.s3.amazonaws.com/image/${user?.id}`,
            gotStarted: user?.gotStarted,
            role: user?.role,
            emailVerified: user?.emailVerified,
        };
    } catch (error) {
        console.error("Error getting user content:", error);
        throw new Error("Failed to get user content");
    }
});
