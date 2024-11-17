"use client";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  FormEvent,
} from "react";
import {
  Image,
  Skeleton,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Link,
  User as StylingUser,
} from "@nextui-org/react";
import axios from "axios";
import parse from "html-react-parser";
import { User } from "@/app/types/db";
import "@/app/rich.css";
import { usePathname } from "next/navigation";
import { MdDelete } from "react-icons/md";
import { IoMdThumbsUp } from "react-icons/io";
import { getUserContent } from "@/app/helpers/getUser";
import Comments from "./Comments";

interface PostProp {
  id: any;
  userId: string;
  fromPage: string;
}

export default function Posts({ userId, fromPage }: PostProp) {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [commentInput, setCommentInput] = useState<string>(""); // New state for comment input
  const sentinelRef = useRef(null);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);
  const maxChars = 400;

  const onOpen = (postId: string) => {
    setOpenModalId(postId);
  };

  const onClose = () => {
    setOpenModalId(null);
  };

  const pageName = usePathname();

  const fetchPosts = useCallback(async () => {
    if (allPostsLoaded) return;

    setIsLoading(true);
    try {
      const res = await axios.post("/api/user/post/my", {
        userId: userId,
        from: fromPage,
        page: page,
        limit: 5,
      });
      if (res.data.length < 5) {
        setAllPostsLoaded(true);
      }
      setPosts((prevPosts) => {
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

  async function handleLike(postId: string, isLiked: boolean) {
    try {
      if (isLiked) {
        await axios.post("/api/user/post/unlike", {
          postId: postId,
        });
      } else {
        await axios.post("/api/user/post/like", {
          postId: postId,
        });
      }
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: isLiked
                  ? post.likes.filter(
                      (like: { userId: any }) => like.userId !== userId
                    )
                  : [...post.likes, { userId: userId }],
              }
            : post
        )
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function handleComment(postId: string) {
    try {
      const res = await axios.post("/api/user/post/comment", {
        postId: postId,
        comment: commentInput,
      });

      // Update the comments of the post in the state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  { userId: userId, content: commentInput },
                ],
              }
            : post
        )
      );

      // Clear the comment input field
      setCommentInput("");
    } catch (error) {
      console.log("Error posting comment:", error);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limit the input to 400 characters
    if (e.target.value.length <= maxChars) {
      setCommentInput(e.target.value);
    }
  };

  return (
    <div className="w-full h-full mb-32 flex flex-col gap-4 scrollbar-webkit scrollbar-thin  overflow-scroll">
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
            likes: any[];
            comments: any[];
          }) => (
            <div
              key={post.id}
              className="border-2 mx-1 bg-white p-2 max-w-full text-wrap whitespace-normal"
            >
              <div className="flex justify-between">
                <Link href={`/ec/${post.authorId}`} className="flex gap-2">
                  <StylingUser
                    name={""} // Add the 'name' property with a value
                    avatarProps={{
                      isBordered: true,
                      src: `https://econnectbucket.s3.amazonaws.com/image/${post.authorId}`,
                    }}
                    className="transition-transform "
                  />

                  <div className="flex flex-col m-0 p-0">
                    <h1 className="font-bold text-black">{`${post.author.firstName} ${post.author.lastName}`}</h1>
                    <h1 className="text-slate-600 pl-2 text-[0.65rem] font-light">
                      {post.author.email}
                    </h1>
                    <h1 className="text-slate-600 pl-2 text-[0.65rem] font-light">
                      {post.author.title}
                    </h1>
                  </div>
                </Link>
                <h1 className="text-xs font-light text-slate-600">
                  {new Date(post.createdAt).toLocaleDateString("en-us", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </h1>
              </div>
              <h1 className="font-bold">{post.title}</h1>
              <div>{parse(post.content)}</div>

              <div className="flex gap-4 m-3">
                <Image
                  width={200}
                  alt="Application Image"
                  src={`https://econnectbucket.s3.amazonaws.com/newPostImage/${post.authorId}/${post.images}/0`}
                />
              </div>
              <div className=" w-full shadow-sm flex justify-between">
                <h1 className="text-xs text-slate-600">
                  {post.likes.length + " Liked this post"}
                </h1>
                <h1 className="text-xs text-slate-600">
                  {post.comments.length} Comments
                </h1>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    color="primary"
                    variant="light"
                    className={`rounded-md ${
                      post.likes.some(
                        (like: { userId: any }) => like.userId === userId
                      )
                        ? "text-blue-400"
                        : "text-black"
                    }`}
                    onPress={() =>
                      handleLike(
                        post.id as string,
                        post.likes.some(
                          (like: { userId: any }) => like.userId === userId
                        )
                      )
                    }
                  >
                    <IoMdThumbsUp
                      color={
                        post.likes.some(
                          (like: { userId: any }) => like.userId === userId
                        )
                          ? "blue"
                          : "black"
                      }
                    />
                    {post.likes.some(
                      (like: { userId: any }) => like.userId === userId
                    )
                      ? "Unlike"
                      : "Like"}
                  </Button>
                </div>
              </div>

              {/* Comment Section */}
              <div className="mt-4 relative">
                {/* Comment Input Field */}
                <input
                  type="text"
                  value={commentInput}
                  onChange={handleInputChange}
                  placeholder="Add a comment..."
                  className="p-2 border border-gray-300 rounded-md w-full light"
                />

                {/* Character Counter */}
                <div className="absolute right-0 top-0 mt-2 mr-2 text-xs text-gray-500">
                  {commentInput.length}/{maxChars}
                </div>

                {/* Submit Button */}
                <Button
                  color="primary"
                  variant="light"
                  className="mt-2"
                  disabled={commentInput.length === 0} // Disable if no input
                  onPress={() => handleComment(post.id as string)}
                >
                  Submit
                </Button>
              </div>

              <div className="mt-4">
                <Comments
                  post={post}
                  commentUserId={userId as unknown as string}
                />
              </div>
            </div>
          )
        )
      )}
      <div ref={sentinelRef} className="h-10 w-full" />
      {isLoading && (
        <div className="flex flex-col gap-4 w-full h-full">
          <Skeleton className="w-full h-24 rounded-md flex flex-col justify-between gap-2 m-4 light" />
          <Skeleton className="w-full h-24 rounded-md flex flex-col justify-between gap-2 m-4 light" />
        </div>
      )}
    </div>
  );
}
