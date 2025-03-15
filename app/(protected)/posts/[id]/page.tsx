"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button, Card, Divider, Spinner, Avatar, Link } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import parse from "html-react-parser";
import PostImages from "../../components/visualComponents/Posts/PostImages";
import PostActions from "../../components/visualComponents/Posts/PostActions";
import { FaArrowLeft } from "react-icons/fa";
import ProtectedNav from "../../components/visualComponents/ProtectedNav";

interface Author {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  title: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface Like {
  id: string;
  userId: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  authorId: string;
  images?: string;
  author: Author;
  comments: Comment[];
  likes: Like[];
}

const PostDetailPage = () => {
  const params = useParams();
  if (!params) throw new Error("No params found");
  const postId = params.id as string;
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>("");


  useEffect(() => {
    const fetchPost = async () => {
      if (!postId || !session?.user?.id) return;
      
      setIsLoading(true);
      try {
        const { data } = await axios.post("/api/user/post/single", {
          postId: postId,
        });
        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post data");
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchPost();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [postId, session, status, router]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !postId || !session?.user?.id) return;

    try {
      await axios.post("/api/user/post/comment", {
        content: commentInput,
        postId: postId,
      });

      const newComment = {
            id: Date.now().toString(),
            content: commentInput.trim(),
            createdAt: new Date(),
            author: {
                id: session?.user?.id,
                firstName: session?.user?.name,
                lastName: "",
            },
        };
      
      // Refresh post data to include the new comment
      const { data } = await axios.post("/api/user/post/single", {
        postId: postId,
      });
      setPost(data);
      setCommentInput("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-xl mb-4">{error || "Post not found"}</p>
        <Button 
          color="primary" 
          variant="flat"
          onPress={() => router.push("/dashboard")}
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const imagesArray = post.images ? post.images.split(",") : [];
  
  return (
    <div>
                <ProtectedNav userInfoId={session?.user.id || ""} userName={session?.user.name || ""} userEmail={session?.user.email || ""} />

        <div className="max-w-4xl mx-auto py-8 px-4">
      <Button
        className="mb-6"
        variant="light"
        startContent={<FaArrowLeft />}
        onPress={() => router.back()}
      >
        Back
      </Button>
      
      <Card className="p-6 mb-8">
        <div className="flex items-center mb-4">
          <Avatar
            src={`https://econnectbucket.s3.amazonaws.com/image/${post.author.id}`}
            fallback={post.author.firstName[0] + post.author.lastName[0]}
            className="mr-4"
            size="lg"
          />
          <div>
            <Link href={`/user/${post.author.id}`} className="text-xl font-semibold hover:text-blue-600">
              {`${post.author.firstName} ${post.author.lastName}`}
            </Link>
            <p className="text-small text-gray-500">{post.author.title || "User"}</p>
            <p className="text-small text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <div className="prose max-w-none mb-6">
          {parse(post.content || "")}
        </div>
        
        {imagesArray.length > 0 && (
          <div className="mb-6">
            <PostImages images={imagesArray} authorId={post.author.id} />
          </div>
        )}
        
        <Divider className="my-4" />
        
        <PostActions
          postId={post.id}
          likes={post.likes}
          comments={post.comments}
          currentUserId={session?.user?.id || ""}
          currentUserName={`${session?.user?.name || ""}`}
          showComments={false}
        />
        
        <Divider className="my-4" />
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Comments ({post.comments.length})</h2>
          
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 p-2 border rounded-lg"
              />
              <Button 
                color="primary" 
                type="submit" 
                isDisabled={!commentInput.trim()}
              >
                Post
              </Button>
            </div>
          </form>
          
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <Avatar
                    src={`https://econnectbucket.s3.amazonaws.com/image/${comment.author.id}`}
                    fallback={comment.author.firstName[0] + comment.author.lastName[0]}
                    className="mr-2"
                    size="sm"
                  />
                  <div>
                    <Link href={`/user/${comment.author.id}`} className="font-semibold hover:text-blue-600">
                      {`${comment.author.firstName} ${comment.author.lastName}`}
                    </Link>
                    <p className="text-small text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="pl-10">{comment.content}</p>
              </div>
            ))}
            
            {post.comments.length === 0 && (
              <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </Card>
    </div>
    </div>
    
  );
};

export default PostDetailPage; 