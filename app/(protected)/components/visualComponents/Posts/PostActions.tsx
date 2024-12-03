import { Heart, MessageSquare, Share2, Trash2 } from "lucide-react";
import { useState } from "react";

interface PostActionsProps {
    likes: number;
    comments: Comment[];
    shares: number;
}

const MAX_COMMENT_LENGTH = 400;

const PostActions = ({
    likes: initialLikes,
    comments,
    shares,
}: PostActionsProps) => {
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [comment, setComment] = useState("");
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(initialLikes);

    // Mock comments data - in a real app, this would come from props or an API
    const [commentsList, setCommentsList] = useState<Comment[]>([comments]);

    const handleLike = () => {
        setLiked(!liked);
        setLikes((prev) => (liked ? prev - 1 : prev + 1));
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= MAX_COMMENT_LENGTH) {
            setComment(value);
        }
    };

    const handleSubmitComment = () => {
        if (comment.trim()) {
            const newComment: Comment = {
                id: Date.now(),
                user: "Current User", // In a real app, this would come from auth
                text: comment.trim(),
                timestamp: "Just now",
                isAuthor: true,
            };
            setCommentsList((prev) => [...prev, newComment]);
            setComment("");
        }
    };

    const handleDeleteComment = (commentId: number) => {
        setCommentsList((prev) =>
            prev.filter((comment) => comment.id !== commentId)
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <button
                    onClick={handleLike}
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
                    <span>{likes}</span>
                </button>

                <button
                    onClick={() => setShowCommentInput(!showCommentInput)}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
                >
                    <MessageSquare className="w-5 h-5" />
                    <span>{comments}</span>
                </button>

                <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>{shares}</span>
                </button>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
                {commentsList.slice(0, 3).map((comment) => (
                    <div
                        key={comment.id}
                        className="flex flex-col space-y-1 p-2 rounded-lg bg-gray-50"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">
                                {comment.user}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                    {comment.timestamp}
                                </span>
                                {comment.isAuthor && (
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
                        <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                ))}

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
                            {commentsList.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="flex flex-col space-y-1 p-3 rounded-lg bg-gray-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-sm">
                                            {comment.user}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">
                                                {comment.timestamp}
                                            </span>
                                            {comment.isAuthor && (
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
                                        {comment.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {showCommentInput && (
                <div className="space-y-2">
                    <div className="relative">
                        <Input
                            placeholder="Write a comment..."
                            value={comment}
                            onChange={handleCommentChange}
                            className="pr-16 w-full"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                            {comment.length}/{MAX_COMMENT_LENGTH}
                        </span>
                    </div>
                    <Button
                        onClick={handleSubmitComment}
                        disabled={!comment.trim()}
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
