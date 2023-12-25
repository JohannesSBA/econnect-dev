import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  try {
    // Update the user's friends list by adding the accepted friend
    await prisma.user.update({
      where: { email: body.email },
      data: {
        friends: {
          connect: { id: body.id },
        },
        pendingFriendRequest: {
          disconnect: { id: body.id },
        },
      },
    });

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something Went wrong", { status: 500 });
  }
}
