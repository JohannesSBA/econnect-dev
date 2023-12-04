// import { getServerSession } from "next-auth";
// import { options } from "../api/auth/[...nextauth]/options";
// import prisma from "../lib/prisma";

// export const getFriends = async (friendsOf: string) => {
//   try {
//     const session = await getServerSession(options);
//     const email = session?.user.email as string;

//     if (friendsOf === "") {
//       friendsOf = email;
//     }

//     if (!session) return;

//     const user = await prisma.user.findUnique({
//       where: {
//         email: friendsOf as string,
//       },
//       select: {
//         friends: true,
//         friendOf: true,
//       },
//     });

//     if (!user) {
//       throw new Error("User not found");
//     }

//     return {
//       friend: user.friendOf,
//     };
//   } catch (error) {
//     // Handle the error, log it, or return a meaningful error response.
//     console.error("Error in getUserBio:", error);
//     return { error: error };
//   }
// };
