import { MessageSquare, Heart, Share2 } from "lucide-react";
import PostImages from "./PostImages";
import PostActions from "./PostActions";
import parse from "html-react-parser";
import Link from "next/link";

interface PostProps {
    id: string;
    createdAt: Date;
    userId: string;
    updatedAt: Date;
    title: string;
    content?: string;
    images?: string;
    published: boolean;
    author?: {
        id: string;
        firstName: string;
        lastName: string;
        image: string;
    };
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
    likes: {
        id: string;
        userId: string;
    }[];
    currentUserName: string;
}

const Post = ({
    id,
    author,
    content,
    images,
    comments,
    likes,
    createdAt,
    userId,
    currentUserName,
    title,
}: PostProps) => {
    const imagesArray = images ? images.split(",") : [];
    const likesCount = likes.length;
    const commentsCount = comments.length;

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 max-w-2xl w-full animate-fade-in">
            <div className="flex items-center mb-4">
                <img
                    src={
                        `https://econnectbucket.s3.amazonaws.com/image/${author?.id}` ||
                        "https://i.pravatar.cc/300"
                    }
                    alt={author?.firstName || "Anonymous"}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                    <h3 className="font-semibold text-gray-900">
                        {author?.firstName + " " + author?.lastName ||
                            "Anonymous"}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {new Date(createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <Link href={`/posts/${id}`} className="block">
                <h1 className="font-semibold hover:text-blue-600 transition-colors">{title}</h1>
            </Link>
            <div className="text-gray-800 mb-4 mt-2 line-clamp-3">
                {parse(content || "")}
            </div>

            {imagesArray.length > 0 && (
                <PostImages images={imagesArray} authorId={author?.id || ""} />
            )}

            <div className="border-t border-gray-100 mt-4 pt-2">
                <PostActions
                    postId={id}
                    likes={likes}
                    comments={comments}
                    currentUserId={userId} // This should come from your auth context
                    currentUserName={currentUserName} showComments={true}                />
            </div>
        </div>
    );
};

export default Post;
