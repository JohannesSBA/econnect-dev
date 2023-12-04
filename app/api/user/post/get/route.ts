// import prisma from "@/app/lib/prisma";

// export async function GET(req: Request, res: Response) {
//   try {
//     console.log(req.formData.arguments);

//     const users = await prisma.post.findMany({
//       where: {
//         authorId: "Johannes",
//       },
//       select: {
//         author: true,
//         authorId: true,
//         categories: true,
//         content: true,
//         createdAt: true,
//         published: true,
//         title: true,
//         updatedAt: true,
//         id: true,
//       },
//     });

//     const stringfiedUsers = JSON.stringify(users);

//     return new Response(stringfiedUsers, { status: 200 });
//   } catch (error) {
//     return new Response("Something went wrong", { status: 500 });
//   }

//   if (req.method !== "GET") {
//     return new Response("Method not allowed", { status: 403 });
//   }
// }
