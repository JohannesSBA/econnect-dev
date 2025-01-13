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
}

const MAX_COMMENT_LENGTH = 400;

const PostActions = ({
    postId,
    likes,
    comments: initialComments,
    currentUserId,
    currentUserName,
}: PostActionsProps) => {
    const [showCommentInput, setShowCommentInput] = useState(false);
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

    async function handleSubmitComment() {
        try {
            const res = await axios.post("/api/user/post/comment", {
                postId: postId,
                comment: commentInput,
            });
        } catch (error) {
            console.log(error);
        }
        const newComment = {
            id: Date.now().toString(),
            content: commentInput.trim(),
            createdAt: new Date(),
            author: {
                id: currentUserId,
                firstName: currentUserName,
                lastName: "",
            },
        };
        setComments((prev) => [...prev, newComment]);
        setComment("");
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
            <div className="flex justify-between items-center">
                <button
                    onClick={() => handleLike(postId, liked)}
                    className={`flex items-center gap-2 transition-colors ${
                        liked
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-blue-600"
                    }`}
                >
                    <Heart
                        className="w-5 h-5"
                        fill={liked ? "currentColor" : "none"}
                    />
                    <span>{localLikes.length}</span>
                </button>

                <button
                    onClick={() => setShowCommentInput(!showCommentInput)}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
                >
                    <MessageSquare className="w-5 h-5" />
                    <span>{comments.length}</span>
                </button>

                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>0</span>
                </button>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
                {comments.slice(0, 3).map((comment) => (
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

                {comments.length > 0 && comments.length > 3 && (
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

            {showCommentInput && (
                <div className="space-y-2">
                    <div className="relative">
                        <Input
                            placeholder="Write a comment..."
                            value={commentInput}
                            onChange={handleCommentChange}
                            className="pr-16 w-full"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                            {comment.length}/{MAX_COMMENT_LENGTH}
                        </span>
                    </div>
                    <Button
                        onClick={handleSubmitComment}
                        disabled={!commentInput.trim()}
                        className="w-full"
                    >
                        Submit Comment
                    </Button>
                </div>
            )}
        </div>
    );
};

export default PostActions;
