"use client";
import { Heart, MessageSquare, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import axios from "axios";
import Link from "next/link";

interface PostActionsProps {
    postId: string;
    likes: {
        id: string;
        userId: string;
    }[];
    comments: {
        id: string;
        content: string;
        createdAt: Date;
        author: {
            id: string;
            firstName: string;
            lastName: string;
        };
    }[];
    currentUserId: string;
    currentUserName: string;
    showComments: boolean;
}

const MAX_COMMENT_LENGTH = 400;

const PostActions = ({
    postId,
    likes,
    comments: initialComments,
    currentUserId,
    currentUserName,
    showComments,
}: PostActionsProps) => {
    const [comment, setComment] = useState("");
    const [commentInput, setCommentInput] = useState("");
    const [liked, setLiked] = useState(
        likes.some((like) => like.userId === currentUserId)
    );
    const [localLikes, setLocalLikes] = useState(likes);
    const [comments, setComments] = useState(initialComments);

    async function handleLike(postId: string, isLiked: boolean) {
        try {
            if (isLiked) {
                await axios.post("/api/user/post/unlike", {
                    postId: postId,
                });
                setLocalLikes((prev) =>
                    prev.filter((like) => like.userId !== currentUserId)
                );
            } else {
                await axios.post("/api/user/post/like", {
                    postId: postId,
                });
                setLocalLikes((prev) => [
                    ...prev,
                    { id: Date.now().toString(), userId: currentUserId },
                ]);
            }
            setLiked(!liked);
        } catch (error) {
            console.log(error);
        }
    }

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= MAX_COMMENT_LENGTH) {
            setCommentInput(value);
        }
    };

    async function handleComment(e: React.FormEvent) {
        e.preventDefault();
        if (!commentInput.trim()) return;
        
        try {
            await axios.post("/api/user/post/comment", {
                postId,
                content: commentInput
            });
            
            // Add the new comment to the local state
            const newComment = {
                id: Date.now().toString(),
                content: commentInput,
                createdAt: new Date(),
                author: {
                    id: currentUserId,
                    firstName: currentUserName.split(" ")[0] || "",
                    lastName: currentUserName.split(" ")[1] || ""
                }
            };
            
            setComments((prev) => [newComment, ...prev]);
            setCommentInput("");
        } catch (error) {
            console.log(error);
        }
    }

    async function handleDeleteComment(commentId: string) {
        try {
            await axios.post("/api/user/post/comment/delete", { commentId });
        } catch (error) {
            console.log(error);
        } finally {
            setComments((prev) =>
                prev.filter((comment) => comment.id !== commentId)
            );
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col items-center justify-between">
                <div className="flex space-x-4">
                    <button
                        onClick={() => handleLike(postId, liked)}
                        className={`flex items-center space-x-1.5 ${
                            liked ? "text-pink-500" : "text-gray-500 hover:text-pink-500"
                        }`}
                    >
                        <Heart
                            className={`h-5 w-5 ${liked ? "fill-current" : ""}`}
                        />
                        <span>{localLikes.length}</span>
                    </button>

                    <Link
                        href={`/posts/${postId}`}
                        className="flex items-center space-x-1.5 text-gray-500 hover:text-blue-500"
                    >
                        <MessageSquare className="h-5 w-5" />
                        <span>{comments.length}</span>
                    </Link>

                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="flex items-center space-x-1.5 text-gray-500 hover:text-blue-500">
                                <Share2 className="h-5 w-5" />
                                <span>Share</span>
                            </button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Share this post</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col space-y-4 p-4">
                                <Input
                                    value={`${window.location.origin}/posts/${postId}`}
                                    readOnly
                                />
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            `${window.location.origin}/posts/${postId}`
                                        );
                                    }}
                                >
                                    Copy Link
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Comments Section */}
                <div className="mt-4 space-y-4 w-full">
                    {showComments && comments.slice(0, 3).map((comment) => (
                        <div
                            key={comment.id}
                            className="flex flex-col space-y-1 p-2 rounded-lg bg-gray-50"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm">
                                    {comment.author.firstName +
                                        " " +
                                        comment.author.lastName}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">
                                        {new Date(
                                            comment.createdAt
                                        ).toLocaleDateString()}
                                    </span>
                                    {comment.author.id === currentUserId && (
                                        <button
                                            onClick={() =>
                                                handleDeleteComment(comment.id)
                                            }
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">
                                {comment.content}
                            </p>
                        </div>
                    ))}

                    {showComments && comments.length > 0 && comments.length > 3 && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    Show more comments
                                </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Comments</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                    {comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="flex flex-col space-y-1 p-3 rounded-lg bg-gray-50"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-sm">
                                                    {comment.author.firstName +
                                                        " " +
                                                        comment.author.lastName}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(
                                                            comment.createdAt
                                                        ).toLocaleDateString()}
                                                    </span>
                                                    {comment.author.id ===
                                                        currentUserId && (
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteComment(
                                                                    comment.id
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-600"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700">
                                                {comment.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>

            {/* Comment input */}
            {showComments && <div className="mt-4">
                <form onSubmit={handleComment} className="flex items-center space-x-2">
                    <Input
                        value={commentInput}
                        onChange={handleCommentChange}
                        placeholder="Add a comment..."
                        className="flex-1"
                        maxLength={MAX_COMMENT_LENGTH}
                    />
                    <Button 
                        type="submit" 
                        disabled={!commentInput.trim()}
                        size="sm"
                    >
                        Post
                    </Button>
                </form>
                {commentInput.length > 0 && (
                    <div className="text-xs text-gray-500 text-right mt-1">
                        {commentInput.length}/{MAX_COMMENT_LENGTH}
                    </div>
                )}
            </div>}
        </div>
    );
};

export default PostActions;
