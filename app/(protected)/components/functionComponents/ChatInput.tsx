"use client";
import { FunctionComponent, useState } from "react";
import axios from "axios";
import { IoIosSend } from "react-icons/io";
import { Button } from "@nextui-org/react";
import { toast } from "sonner";
import Tiptap from "./textEditor/Tiptap";

interface ChatInputProps {
    chatPartner: string;
    chatId: string;
    chatRoom: string;
}

const ChatInput: FunctionComponent<ChatInputProps> = ({
    chatPartner,
    chatId,
    chatRoom,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [content, setContent] = useState<string>("");

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
    };

    const sendMessage = async () => {
        if (!content) return; // Don't send empty messages
        setIsLoading(true);
        try {
            await axios.post("/api/message/send", {
                text: content,
                chatId,
                chatPartner,
                chatRoom,
            });
            // Do not clear the content here, as it is handled inside Tiptap
        } catch (error) {
            console.error("Error sending message:", error); // Log the error
            toast.error("Something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative border-t border-gray-200 p-2">
            <Tiptap
                content={content}
                onChange={handleContentChange}
                onSendMessage={sendMessage}
            />
            <div className="absolute right-4 bottom-4 flex items-center">
                <div className="flex-shrink-0">
                    {content && (
                        <Button
                            onClick={sendMessage}
                            isLoading={isLoading}
                            color="primary"
                            type="submit"
                            isIconOnly
                        >
                            <IoIosSend />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
