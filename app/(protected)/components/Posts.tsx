"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/app/lib/prisma";
import axios, { AxiosError } from "axios";
import parse from "html-react-parser";

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

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.post("/api/user/post/my", {
                    userId: id,
                });
                setPosts(res.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, [id]);

    console.log(posts);

    return (
        <div className="w-full h-full flex flex-col flex-wrap gap-4">
            {posts.map(
                (post: {
                    id: React.Key | null | undefined;
                    content: any;
                    title: any;
                    createdAt: Date;
                }) => (
                    <div
                        key={post.id}
                        className="shadow-md my-2 mx-1 rounded-md bg-white p-2 "
                    >
                        <div className="flex justify-between">
                            <h1 className="font-bold">{post.title}</h1>
                            <h1 className="text-sm font-light text-slate-600">
                                {new Date(post.createdAt).toLocaleDateString(
                                    "en-us",
                                    {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    }
                                )}
                            </h1>
                        </div>
                        <h1 className="pl-2 text-sm text-slate-500">
                            {parse(post.content)}
                        </h1>
                    </div>
                )
            )}
        </div>
    );
}
