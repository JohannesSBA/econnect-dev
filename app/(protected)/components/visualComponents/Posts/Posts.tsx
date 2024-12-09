"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Post from "./Post";
import axios from "axios";
import { Card, Spinner } from "@nextui-org/react";
import Loading from "@/app/(protected)/job/[id]/loading";
import WaterDropletLoader from "@/app/components/WaterDropLoader";
import { divide } from "lodash";
import FindPeople from "../FindPeople";

interface PProps {
    userId: string;
    currentUserName: string;
    fromPage: string;
}

const Posts = ({ userId, currentUserName, fromPage }: PProps) => {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [commentInput, setCommentInput] = useState<string>(""); // New state for comment input
    const sentinelRef = useRef(null);
    const [openModalId, setOpenModalId] = useState<string | null>(null);
    const [allPostsLoaded, setAllPostsLoaded] = useState(false);
    const maxChars = 400;

    const fetchPosts = useCallback(async () => {
        if (allPostsLoaded) return;

        setIsLoading(true);
        try {
            const res = await axios.post("/api/user/post/my", {
                userId: userId,
                from: fromPage,
                page: page,
                limit: 3,
            });
            if (res.data.length < 3) {
                setAllPostsLoaded(true);
            }
            setPosts((prevPosts) => {
                const newPosts = res.data.filter(
                    (post: any) =>
                        !prevPosts.some((prevPost) => prevPost.id === post.id)
                );
                return [...prevPosts, ...newPosts];
            });
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setIsLoading(false);
        }
    }, [allPostsLoaded, userId, page, fromPage]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoading && !allPostsLoaded) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        const currentRef = sentinelRef.current;

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [allPostsLoaded, isLoading]);

    if (posts.length <= 0) {
        return (
            <div className="w-full h-full flex justify-center items-center flex-col md:pt-8">
                <h1>You have No Friends Yet! Add some to see their Posts</h1>
                <FindPeople />
            </div>
        );
    } else {
        return (
            <div className="h-full flex flex-col items-center rounded-md text-black">
                {Array.isArray(posts) ? (
                    posts.map((post: any) => (
                        <Post
                            key={post.id}
                            userId={userId}
                            currentUserName={currentUserName}
                            {...post}
                        />
                    ))
                ) : (
                    <p>{posts}</p>
                )}
                <div ref={sentinelRef}></div>
                {isLoading && <Spinner />}
            </div>
        );
    }
};

export default Posts;
