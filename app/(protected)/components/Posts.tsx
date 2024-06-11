"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Image, Skeleton } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";
import "@/app/rich.css";
import axios, { AxiosError } from "axios";
import parse from "html-react-parser";
import { User } from "@/app/types/db";

interface PostProp {
  id: string;
}

export default function Posts(id: PostProp) {
  interface PageProps {
    params: {
      posts: string;
    };
  }

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.post("/api/user/post/my", {
          userId: "",
        });
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [id]);

  console.log("posts", posts);
  if (isLoading)
    return (
      <div className="flex flex-col gap-4 w-full h-full">
        <Skeleton className="w-full h-16 rounded-md flex flex-col justify-between gap-2 m-4" />
        <Skeleton className="w-full h-16 rounded-md flex flex-col justify-between gap-2 m-4" />
        <Skeleton className="w-full h-16 rounded-md flex flex-col justify-between gap-2 m-4" />
        <Skeleton className="w-full h-16 rounded-md flex flex-col justify-between gap-2 m-4" />
      </div>
    );
  else {
    return (
      <div className="w-full h-full flex flex-col gap-4 overflow-scroll scrollbar-webkit scrollbar-thin">
        {posts.length === 0 ? (
          <h1>
            No Posts Currently Avaiable. Add Some friends to see their posts
          </h1>
        ) : (
          posts.map(
            (post: {
              images: any;
              id: React.Key | null | undefined;
              content: any;
              title: any;
              createdAt: Date;
              author: User;
              authorId: string;
            }) => (
              <div
                key={post.id}
                className="shadow-md my-2 mx-1 rounded-md bg-white p-2 max-w-full overflow-x-clip text-wrap whitespace-normal"
              >
                <div className="flex justify-between">
                  <h1 className="font-bold">{post.author?.firstName}</h1>
                  <h1 className="font-bold">{post.title}</h1>
                  <h1 className="text-sm font-light text-slate-600">
                    {new Date(post.createdAt).toLocaleDateString("en-us", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </h1>
                </div>
                <div>{parse(post.content)}</div>
                <div className="flex gap-4 m-3">
                  <Image
                    width={200}
                    alt="Application Image"
                    src={`https://econnectbucket.s3.amazonaws.com/newPostImage/${post.authorId}/${post.images}/0`}
                  />
                  <Image
                    width={200}
                    alt="Application Image"
                    src={`https://econnectbucket.s3.amazonaws.com/newPostImage/${post.authorId}/${post.images}/1`}
                  />
                  <Image
                    width={200}
                    alt="Application Image"
                    src={`https://econnectbucket.s3.amazonaws.com/newPostImage/${post.authorId}/${post.images}/2`}
                  />
                </div>
              </div>
            )
          )
        )}
      </div>
    );
  }
}
