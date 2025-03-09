import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin":
        "http://localhost:8081, exp://192.168.1.72:8081",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: Request, res: Response) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 403 });
  }

  const body = await req.json();

  const offset = body.page * body.limit;

  if (body.device === "mobile") {
    const token = req.headers.get("Authorization");
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }
    const authToken = token.split(" ")[1];
    const decoded = jwt.verify(
      authToken,
      process.env.NEXTAUTH_SECRET as string
    );
    const { userId } = decoded as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { friends: { select: { id: true } } },
    });
    const friendIds = user?.friends.map((friend) => friend.id);

    const posts = await prisma.post.findMany({
      where: {
        authorId: { in: friendIds },
      },
      skip: offset,
      take: body.limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            email: true,
            location: true,
            lastName: true,
            title: true,
            likes: true,
          },
        },
        likes: true,
        comments: {
          select: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            content: true,
            createdAt: true,
            postId: true,
            id: true,
          },
        },
        categories: true,
        reports: true,
        savedBy: true,
      }, // Include only the id and name of the author
    });

    const trendingPosts = await prisma.post.findMany({
      where: {
        likes: {
          some: {},
        },
      },
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
      take: body.limit + 5,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            email: true,
            location: true,
            lastName: true,
            title: true,
            likes: true,
          },
        },
        likes: true,
        comments: {
          select: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            content: true,
            createdAt: true,
            postId: true,
            id: true,
          },
        },
        categories: true,
        reports: true,
        savedBy: true,
      },
    });

    const response = posts.concat(trendingPosts);

    const stringifiedPosts = JSON.stringify(response);

    console.log(trendingPosts);

    return new Response(JSON.stringify(stringifiedPosts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
          "http://localhost:8081, exp://192.168.1.72:8081", // Include CORS if needed
      },
    });
  }

  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (body.from === "my") {
    try {
      const posts = await prisma.post.findMany({
        where: { authorId: body.userId },
        skip: offset,
        take: body.limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              email: true,
              location: true,
              lastName: true,
              title: true,
              likes: true,
            },
          },
          likes: true,
          comments: {
            select: {
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
              content: true,
              createdAt: true,
              postId: true,
              id: true,
            },
          },
          categories: true,
          reports: true,
          savedBy: true,
        }, // Include only the id and name of the author
      });
      const stringifiedPosts = JSON.stringify(posts);

      return new Response(stringifiedPosts, { status: 200 });
    } catch (error) {
      return new Response("Something went wrong", { status: 500 });
    }
  } else if (body.from === "default") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { friends: { select: { id: true } } },
      });
      const friendIds = user?.friends.map((friend) => friend.id); // Add null check for user
      const posts = await prisma.post.findMany({
        where: {
          authorId: { in: friendIds },
        },
        skip: offset,
        take: body.limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              email: true,
              location: true,
              lastName: true,
              title: true,
              likes: true,
            },
          },
          likes: true,
          comments: {
            select: {
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
              content: true,
              createdAt: true,
              postId: true,
              id: true,
            },
          },
          categories: true,
          reports: true,
          savedBy: true,
        }, // Include only the id and name of the author
      });

      const stringifiedPosts = JSON.stringify(posts);
      return new Response(stringifiedPosts, { status: 200 });
    } catch (error) {
      return new Response("Something went wrong", { status: 500 });
    }
  } else {
    try {
      const userId = body.userId;
      const posts = await prisma.post.findMany({
        where: { authorId: userId },
        skip: offset,
        take: body.limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              email: true,
              location: true,
              lastName: true,
              title: true,
              likes: true,
            },
          },
          likes: true,
          comments: {
            select: {
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
              content: true,
              createdAt: true,
              postId: true,
            },
          },
          categories: true,
          reports: true,
          savedBy: true,
        }, // Include only the id and name of the author
      });
      const stringifiedPosts = JSON.stringify(posts);

      return new Response(stringifiedPosts, { status: 200 });
    } catch (error) {
      return new Response("Something went wrong", { status: 500 });
    }
  }
}
