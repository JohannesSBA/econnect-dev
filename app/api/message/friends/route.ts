import prisma from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request, res: Response) {
  const token = req.headers.get("Authorization");
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }
  const authToken = token.split(" ")[1];
  const decoded = jwt.verify(authToken, process.env.NEXTAUTH_SECRET as string);
  if (!decoded) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { userId } = decoded as { userId: string };
  // Get all users where there exists a message between the user and any other users
  const usersWithMessages = await prisma.user.findMany({
    where: {
      OR: [
        {
          messagesSent: {
            some: {
              recipientId: userId,
            },
          },
        },
        {
          messagesReceived: {
            some: {
              senderId: userId,
            },
          },
        },
        {
          messagesRead: {
            some: {
              recipientId: userId,
            },
          },
        },
      ],
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  const usersWithLastMessage = await Promise.all(
    usersWithMessages.map(async (user) => {
      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            {
              senderId: userId,
              recipientId: user.id,
            },
            {
              senderId: user.id,
              recipientId: userId,
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          text: true,
          senderId: true,
          createdAt: true,
          readAt: true,
          readBy: true,
        },
      });
      return {
        ...user,
        lastMessage,
      };
    })
  );

  return new Response(JSON.stringify(usersWithLastMessage), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:8081", // Include CORS if needed
    },
  });

  return new Response(JSON.stringify(usersWithMessages), { status: 200 });
}

//   await axios.post("/api/message/send", { text: input, chatId });
