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
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Input,
} from "@nextui-org/react";
import axios from "axios";
import parse from "html-react-parser";
import { User } from "@/app/types/db";
import "@/app/rich.css";
import { usePathname } from "next/navigation";
import { MdDelete } from "react-icons/md";
import { IoMdChatbubbles, IoMdThumbsUp } from "react-icons/io";
import { getUserContent } from "@/app/helpers/getUser";
import Comments from "../Comments";
import WaterDropletLoader from "@/app/components/WaterDropLoader";
import PostActions from "./PostActions";

interface PostProps {
    userId: string;
    userName: string;
    content: Comments[];
    images: string[];
    likes: number;
    comments: number;
    fromPage: string;
}

// export default function Posts({ userId, fromPage }: PostProp) {
// const [posts, setPosts] = useState<any[]>([]);
// const [isLoading, setIsLoading] = useState(true);
// const [page, setPage] = useState(0);
// const [commentInput, setCommentInput] = useState<string>(""); // New state for comment input
// const sentinelRef = useRef(null);
// const [openModalId, setOpenModalId] = useState<string | null>(null);
// const [allPostsLoaded, setAllPostsLoaded] = useState(false);
// const maxChars = 400;

// const onOpen = (postId: string) => {
//     setOpenModalId(postId);
// };

// const onClose = () => {
//     setOpenModalId(null);
// };

// const pageName = usePathname();

// const fetchPosts = useCallback(async () => {
//     if (allPostsLoaded) return;

//     setIsLoading(true);
//     try {
//         const res = await axios.post("/api/user/post/my", {
//             userId: userId,
//             from: fromPage,
//             page: page,
//             limit: 5,
//         });
//         if (res.data.length < 5) {
//             setAllPostsLoaded(true);
//         }
//         setPosts((prevPosts) => {
//             const newPosts = res.data.filter(
//                 (post: any) =>
//                     !prevPosts.some((prevPost) => prevPost.id === post.id)
//             );
//             return [...prevPosts, ...newPosts];
//         });
//     } catch (error) {
//         console.error("Error fetching posts:", error);
//     } finally {
//         setIsLoading(false);
//     }
// }, [allPostsLoaded, userId, page, fromPage]);

// useEffect(() => {
//     fetchPosts();
// }, [fetchPosts]);

// useEffect(() => {
//     const observer = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && !isLoading && !allPostsLoaded) {
//             setPage((prevPage) => prevPage + 1);
//         }
//     });

//     const currentRef = sentinelRef.current;

//     if (currentRef) {
//         observer.observe(currentRef);
//     }

//     return () => {
//         if (currentRef) {
//             observer.unobserve(currentRef);
//         }
//     };
// }, [allPostsLoaded, isLoading]);

// async function handleDeletePost(postId: string, images: string) {
//     try {
//         await axios.post("/api/user/post/delete", { postId });
//         await axios.post("/api/s3-delete", { ImageId: images });
//     } catch (error) {
//         console.log(error);
//     } finally {
//         window.location.reload();
//     }
// }

// async function handleLike(postId: string, isLiked: boolean) {
//     try {
//         if (isLiked) {
//             await axios.post("/api/user/post/unlike", {
//                 postId: postId,
//             });
//         } else {
//             await axios.post("/api/user/post/like", {
//                 postId: postId,
//             });
//         }
//         setPosts((prevPosts) =>
//             prevPosts.map((post) =>
//                 post.id === postId
//                     ? {
//                           ...post,
//                           likes: isLiked
//                               ? post.likes.filter(
//                                     (like: { userId: any }) =>
//                                         like.userId !== userId
//                                 )
//                               : [...post.likes, { userId: userId }],
//                       }
//                     : post
//             )
//         );
//     } catch (error) {
//         console.log(error);
//     }
// }

// async function handleComment(postId: string) {
//     try {
//         const res = await axios.post("/api/user/post/comment", {
//             postId: postId,
//             comment: commentInput,
//         });

//         // Update the comments of the post in the state
//         setPosts((prevPosts) =>
//             prevPosts.map((post) =>
//                 post.id === postId
//                     ? {
//                           ...post,
//                           comments: [
//                               ...post.comments,
//                               { userId: userId, content: commentInput },
//                           ],
//                       }
//                     : post
//             )
//         );

//         // Clear the comment input field
//         setCommentInput("");
//     } catch (error) {
//         console.log("Error posting comment:", error);
//     }
// }

// const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     // Limit the input to 400 characters
//     if (e.target.value.length <= maxChars) {
//         setCommentInput(e.target.value);
//     }
// };

// return (
//     <div className="w-full space-y-4 bg-transparent">
//         {posts.map((post) => (
//             <Card key={post.id} className="w-full">
//                 <CardHeader className="justify-between">
//                     <StylingUser
//                         name={`${post.author.firstName} ${post.author.lastName}`}
//                         description={
//                             <div>
//                                 <p className="text-small text-default-500">
//                                     {post.author.email}
//                                 </p>
//                                 <p className="text-small text-default-500">
//                                     {post.author.title}
//                                 </p>
//                             </div>
//                         }
//                         avatarProps={{
//                             src: `https://econnectbucket.s3.amazonaws.com/image/${post.authorId}`,
//                         }}
//                     />
//                     <p className="text-small text-default-500">
//                         {new Date(post.createdAt).toLocaleDateString(
//                             "en-us",
//                             {
//                                 year: "numeric",
//                                 month: "short",
//                                 day: "numeric",
//                             }
//                         )}
//                     </p>
//                 </CardHeader>
//                 <CardBody>
//                     <h2 className="text-lg font-semibold mb-2">
//                         {post.title}
//                     </h2>
//                     <div className="mb-4">{parse(post.content)}</div>
//                     {post.images && (
//                         <Image
//                             alt="Post image"
//                             className="object-cover rounded-xl"
//                             src={`https://econnectbucket.s3.amazonaws.com/newPostImage/${post.authorId}/${post.images}/0`}
//                             width={300}
//                         />
//                     )}
//                 </CardBody>
//                 <Divider />
//                 <CardFooter className="flex flex-col items-start gap-4">
//                     <div className="flex justify-between w-full text-small text-default-500">
//                         <span>
//                             {post.likes.length < 99
//                                 ? post.likes.length
//                                 : "99+"}{" "}
//                             Likes
//                         </span>
//                         <span>{post.comments.length} Comments</span>
//                     </div>
//                     <div className="flex gap-2 w-full">
//                         <Button
//                             color={
//                                 post.likes.some(
//                                     (like: { userId: string }) =>
//                                         like.userId === userId
//                                 )
//                                     ? "primary"
//                                     : "default"
//                             }
//                             variant="flat"
//                             startContent={<IoMdThumbsUp />}
//                             onPress={() =>
//                                 handleLike(
//                                     post.id,
//                                     post.likes.some(
//                                         (like: { userId: string }) =>
//                                             like.userId === userId
//                                     )
//                                 )
//                             }
//                         >
//                             {post.likes.some(
//                                 (like: { userId: string }) =>
//                                     like.userId === userId
//                             )
//                                 ? "Unlike"
//                                 : "Like"}
//                         </Button>
//                         {/* <Button
//             color="default"
//             variant="flat"
//             startContent={<IoMdChatbubbles />}
//           >
//             Comment
//           </Button> */}
//                     </div>
//                     <div className="w-full">
//                         <Input
//                             type="text"
//                             value={commentInput}
//                             onChange={handleInputChange}
//                             placeholder="Add a comment..."
//                             endContent={
//                                 <div className="text-small text-default-500">
//                                     {commentInput.length}/{maxChars}
//                                 </div>
//                             }
//                         />
//                         <Button
//                             color="primary"
//                             className="mt-2"
//                             disabled={commentInput.length === 0}
//                             onPress={() => {
//                                 handleComment(post.id);
//                                 setCommentInput("");
//                             }}
//                         >
//                             Submit
//                         </Button>
//                     </div>
//                     <Comments post={post} id={userId} />
//                 </CardFooter>
//             </Card>
//         ))}
//         {isLoading && <WaterDropletLoader />}
//     </div>
// );

const Post = ({
    userId,
    userName,
    content,
    images,
    likes,
    comments,
}: PostProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 max-w-2xl w-full animate-fade-in">
            <div className="flex items-center mb-4">
                <img
                    src={`https://econnectbucket.s3.amazonaws.com/image/${userId}`}
                    alt={userName}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                    <h3 className="font-semibold text-gray-900">{userName}</h3>
                    <p className="text-sm text-gray-500">Just now</p>
                </div>
            </div>

            <p className="text-gray-800 mb-4">{content}</p>

            {images && images.length > 0 && <PostImages images={images} />}

            <div className="border-t border-gray-100 mt-4 pt-2">
                <PostActions likes={likes} comments={comments} shares={0} />
            </div>
        </div>
    );
};

export default Post;
