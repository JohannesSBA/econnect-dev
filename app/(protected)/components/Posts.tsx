"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Skeleton,
  user,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import parse from "html-react-parser";
import { User } from "@/app/types/db";
import "@/app/rich.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MdDelete } from "react-icons/md";

interface PostProp {
  id: string;
}

export default function Posts(id: PostProp) {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const sentinelRef = useRef(null);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false); // Step 1

  const onOpen = (postId: string) => {
    setOpenModalId(postId);
  };

  const onClose = () => {
    setOpenModalId(null);
  };

  const pageName = usePathname();

  const fetchPosts = useCallback(async () => {
    if (allPostsLoaded) return; // Prevent fetching if all posts are loaded

    setIsLoading(true);
    try {
      const res = await axios.post("/api/user/post/my", {
        userId: id,
        page: page,
        limit: 5, // or any other number you want to use as the limit
      });
      if (res.data.length < 5) {
        // Step 2
        setAllPostsLoaded(true); // No more posts to load
      }
      setPosts((prevPosts) => {
        // Filter out duplicate posts based on their ID
        const newPosts = res.data.filter(
          (post: any) => !prevPosts.some((prevPost) => prevPost.id === post.id)
        );
        return [...prevPosts, ...newPosts];
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [allPostsLoaded, id, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading && !allPostsLoaded) {
        // Step 3
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

  async function handleDeletePost(postId: string, images: string) {
    try {
      await axios.post("/api/user/post/delete", { postId });
      await axios.post("/api/s3-delete", { ImageId: images });
    } catch (error) {
      console.log(error);
    } finally {
      window.location.reload();
    }
  }

  console.log("posts", posts);
  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-scroll scrollbar-webkit scrollbar-thin">
      {posts.length === 0 && !isLoading ? (
        <h1 className="w-full flex justify-center text-center pt-4">
          No Posts Currently Available. <br />
          Add some friends to see their posts.
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
                <div className="flex gap-2">
                  <Image
                    src={`https://econnectbucket.s3.amazonaws.com/image/${post.authorId}`}
                    alt=""
                    className="rounded-full border"
                    width={50}
                    height={50}
                  />
                  <div className="flex flex-col m-0 p-0">
                    <h1 className="font-bold">{`${post.author.firstName} ${post.author.lastName}`}</h1>
                    <h1 className="text-slate-600 pl-2 text-[0.65rem] font-light">
                      {post.author.email}
                    </h1>
                    <h1 className="text-slate-600 pl-2 text-[0.65rem] font-light">
                      {post.author.title}
                    </h1>
                  </div>
                </div>
                <h1 className="text-sm font-light text-slate-600">
                  {new Date(post.createdAt).toLocaleDateString("en-us", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  {pageName === "/dashboard/my-posts" ? (
                    <div>
                      <Button onPress={() => onOpen(post.id as string)}>
                        <MdDelete />
                      </Button>
                      <Modal
                        isOpen={openModalId === post.id}
                        onOpenChange={onClose}
                        className="light"
                      >
                        <ModalContent className="">
                          {(onClose) => (
                            <>
                              <ModalHeader className="flex flex-col gap-1 text-black">
                                Delete Post
                              </ModalHeader>
                              <ModalBody className="text-black">
                                <p>
                                  Are you sure you want to delete the post? Once
                                  deleted, it cannot be recovered.
                                </p>
                                <p>{post.title}</p>
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  color="danger"
                                  variant="light"
                                  onPress={onClose}
                                >
                                  Close
                                </Button>
                                <Button
                                  color="primary"
                                  onPress={() =>
                                    handleDeletePost(
                                      post.id as string,
                                      post.images as string
                                    )
                                  }
                                >
                                  Delete
                                </Button>
                              </ModalFooter>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
                    </div>
                  ) : (
                    ""
                  )}
                </h1>
              </div>
              <h1 className="font-bold">{post.title}</h1>
              <div>{parse(post.content)}</div>
              <div className="flex gap-4 m-3">
                <Image
                  width={200}
                  height={200}
                  alt="Application Image"
                  src={`https://econnectbucket.s3.amazonaws.com/newPostImage/${post.authorId}/${post.images}/0`}
                />
                <Image
                  width={200}
                  height={200}
                  alt="Application Image"
                  src={`https://econnectbucket.s3.amazonaws.com/newPostImage/${post.authorId}/${post.images}/1`}
                />
                <Image
                  width={200}
                  height={200}
                  alt="Application Image"
                  src={`https://econnectbucket.s3.amazonaws.com/newPostImage/${post.authorId}/${post.images}/2`}
                />
              </div>
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    color="success"
                    variant="light"
                    className="rounded-md"
                  >
                    Like
                  </Button>
                  <Button
                    color="warning"
                    variant="light"
                    className="rounded-md"
                  >
                    Comment
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    color="warning"
                    variant="light"
                    className="rounded-md"
                  >
                    Report
                  </Button>
                </div>
              </div>
            </div>
          )
        )
      )}
      <div ref={sentinelRef} className="h-10 w-full" />
      {isLoading && (
        <div className="flex flex-col gap-4 w-full h-full">
          <Skeleton className="w-full h-16 rounded-md flex flex-col justify-between gap-2 m-4" />
          <Skeleton className="w-full h-16 rounded-md flex flex-col justify-between gap-2 m-4" />
          <Skeleton className="w-full h-16 rounded-md flex flex-col justify-between gap-2 m-4" />
          <Skeleton className="w-full h-16 rounded-md flex flex-col justify-between gap-2 m-4" />
        </div>
      )}
    </div>
  );
}
