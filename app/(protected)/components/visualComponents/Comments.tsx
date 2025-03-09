import { useState } from "react";
import {
  Modal,
  Button,
  Image,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  User as StylingUser,
} from "@nextui-org/react";
import axios from "axios";
import { User } from "@/app/types/db";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

interface Comment {
  id: string;
  author: Author;
  content: string;
  createdAt: string;
  commentUserId: string; // Comment creator's user ID
}

interface Author {
  firstName: string;
  lastName: string;
  id: string; // Author's user ID
}

interface Post {
  images: any;
  id: React.Key | null | undefined;
  content: any;
  title: any;
  createdAt: Date;
  author: User;
  authorId: string;
  likes: any[];
  comments: Comment[]; // List of comments
}

export default function PostWithComments({
  post,
  id,
}: {
  post: Post;
  id: string;
}) {
  const MAX_COMMENT_LENGTH = 400;
  const [comments, setComments] = useState<Comment[]>(post.comments); // Manage comments state locally
  const [showModal, setShowModal] = useState(false);

  // Get the latest 3 comments from the current state
  const latestComments = comments.slice(0, 3);

  const handleShowMore = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const canDeleteComment = (commentUserId: string) => {
    // A user can delete if they are the post author or the comment author
    return (
      commentUserId === post.authorId ||
      commentUserId === id ||
      post.authorId === id
    );
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.post("/api/user/post/comment/delete", { commentId });

      // Remove the comment from local state in real-time
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-4 w-full">
      {latestComments.slice(0, 3).map((comment: Comment, index: number) => (
        <div
          key={index}
          className="flex flex-col space-y-1 p-2 rounded-lg bg-gray-50"
        >
          <div className="flex gap-2 items-center">
            <StylingUser
              name={""} // Add the 'name' property with a value
              avatarProps={{
                isBordered: true,
                src: `https://econnectbucket.s3.amazonaws.com/image/${comment.author.id}`,
              }}
              className="transition-transform "
            />

            <div>
              <h1 className="font-semibold">
                {comment.author.firstName} {comment.author.lastName}
              </h1>
              <p className="text-slate-800 text-xs pl-2">{comment.content}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <h1>
              {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                timeZone: "UTC",
              })}
            </h1>
            {/* Show delete button if the user is the author or comment creator */}
            {canDeleteComment(comment.author.id) && (
              <Button
                color="danger"
                variant="light"
                size="sm"
                onPress={() => handleDeleteComment(comment.id)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      ))}

      {/* Show More Button */}
      {comments.length > 3 && (
        <Button color="primary" variant="light" onPress={handleShowMore}>
          Show More
        </Button>
      )}

      {/* Modal to Show All Comments */}
      <Modal
        isOpen={showModal}
        onOpenChange={handleCloseModal}
        className="light"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                All Comments
              </ModalHeader>
              <ModalBody>
                {comments.map((comment: Comment, index: number) => (
                  <div
                    key={index}
                    className="text-sm text-gray-700 flex items-center gap-2 justify-between"
                  >
                    <div className="flex gap-2 items-center">
                      <Image
                        src={`https://econnectbucket.s3.amazonaws.com/image/${post.authorId}`}
                        width={50}
                        height={50}
                        alt=""
                        className="rounded-full border"
                      />
                      <div>
                        <h1 className="font-semibold">
                          {/* {post.author.firstName} {post.author.lastName} */}
                        </h1>
                        <p className="text-slate-800 text-xs w-64 pl-2">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end items-center">
                      <h1 className="bg-red-400">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            timeZone: "UTC",
                          }
                        )}
                      </h1>
                      {/* Show delete button if the user is the author or comment creator */}
                      {canDeleteComment(comment.author.id) && (
                        <Button
                          color="danger"
                          variant="light"
                          size="sm"
                          onPress={() => handleDeleteComment(comment.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleCloseModal}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
