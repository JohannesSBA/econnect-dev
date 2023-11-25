import React from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";

export default async function App() {
  const session = await getServerSession(options);

  interface PageProps {
    params: {
      posts: string;
    };
  }

  async function getUserPosts() {
    try {
      const posts = await prisma.post.findMany({
        where: {
          author: { email: session?.user.email },
        },
      });
      const stringified = JSON.stringify(posts);
      return stringified;
    } catch (error) {
      console.log("from error " + error);
    }
  }
  const postsStringified = await getUserPosts();
  const posts = JSON.parse(postsStringified as string); // Parse the stringified JSON

  return (
    <div className="flex flex-col flex-wrap gap-4">
      {posts.map(
        (post: {
          id: React.Key | null | undefined;
          content: any;
          createdAt: Date;
        }) => (
          <div key={post.id} className="w-full p-4 ">
            <Card className="py-4">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <div className="flex justify-between w-full">
                  <p className="text-tiny uppercase font-bold">
                    {session?.user.name}
                  </p>
                  <p className="text-tiny uppercase mb-4">
                    {new Date(post.createdAt).toLocaleDateString("en-us", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <small className="text-default-500">{post.content}</small>
                <h4 className="font-bold text-large"></h4>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <Image
                  alt="Card background"
                  className="object-cover rounded-xl"
                  width={270}
                />
              </CardBody>
            </Card>
          </div>
        )
      )}
    </div>
  );
}
