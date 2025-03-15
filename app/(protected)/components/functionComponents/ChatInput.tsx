"use client";
import { FunctionComponent, useState } from "react";
import axios from "axios";
import { IoIosSend } from "react-icons/io";
import { Button, Tooltip } from "@nextui-org/react";
import { toast } from "sonner";
import Tiptap from "./textEditor/Tiptap";
import { sendSocketMessage, getConnectionStatus } from "@/app/lib/socket";

interface ChatInputProps {
    chatPartner: string;
    chatId: string;
    chatRoom: string;
}

const MAX_MESSAGE_LENGTH = 2000; // Set a reasonable maximum length

const ChatInput: FunctionComponent<ChatInputProps> = ({
    chatPartner,
    chatId,
    chatRoom,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [content, setContent] = useState<string>("");
    const [contentLength, setContentLength] = useState<number>(0);
    const [isRetrying, setIsRetrying] = useState<boolean>(false);

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        // Estimate the text content length by removing HTML tags
        const textContent = newContent.replace(/<[^>]*>/g, '');
        setContentLength(textContent.length);
    };

    const sendMessage = async () => {
        if (!content || contentLength > MAX_MESSAGE_LENGTH) return;
        setIsLoading(true);
        
        try {
            // Check connection status
            const connectionStatus = getConnectionStatus();
            if (connectionStatus !== 'connected') {
                console.log(`Socket connection status: ${connectionStatus}`);
                // Continue anyway, as our improved sendSocketMessage will queue if needed
            }
            
            // Create message data
            const messageData = {
                text: content,
                senderId: chatId,
                recipientId: chatPartner,
                createdAt: new Date().toISOString(),
                deliveredAt: new Date().toISOString(),
            };
            
            // First save the message to the database
            await axios.post("/api/message/send", {
                text: content,
                chatId,
                chatPartner,
                chatRoom,
            });
            
            // Clear the editor content after successful database save
            setContent("");
            
            // Then emit via socket for real-time delivery with reliability
            // Only attempt direct socket emit if we're connected
            if (connectionStatus === 'connected') {
                try {
                    await sendSocketMessage('send-message', {
                        chatRoom,
                        messageData
                    });
                } catch (socketError) {
                    console.error("Socket delivery error:", socketError);
                    // Message is already saved in DB and will sync when connection returns
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Message failed to send. Retrying...");
            
            // Retry logic for database save failures
            if (!isRetrying) {
                setIsRetrying(true);
                setTimeout(async () => {
                    try {
                        await axios.post("/api/message/send", {
                            text: content,
                            chatId,
                            chatPartner,
                            chatRoom,
                        });
                        setContent(""); // Clear content after successful retry
                        toast.success("Message sent successfully after retry");
                    } catch (retryError) {
                        console.error("Retry failed:", retryError);
                        toast.error("Failed to send message after retry. Please try again.");
                    } finally {
                        setIsRetrying(false);
                    }
                }, 2000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isOverLimit = contentLength > MAX_MESSAGE_LENGTH;

    return (
        <div 
            className="relative border-t border-gray-200 bg-white rounded-b-lg shadow-inner p-3 md:p-4"
            aria-label="Message input area"
        >
            <div className="max-w-full mx-auto">
                <div className="relative flex flex-col">
                    <Tiptap
                        content={content}
                        onChange={handleContentChange}
                        onSendMessage={sendMessage}
                    />
                    
                    <div className="flex justify-between items-center px-3 py-1 text-xs text-gray-500">
                        <div className={`transition-colors ${isOverLimit ? 'text-red-500 font-medium' : ''}`}>
                            {contentLength}/{MAX_MESSAGE_LENGTH}
                        </div>
                        
                        <div>
                            Press Enter to send
                        </div>
                    </div>
                    
                    <div className="absolute right-3 bottom-12 sm:bottom-3 flex items-center">
                        <Tooltip content={!content.trim() ? "Type a message" : "Send message"}>
                            <Button
                                onClick={sendMessage}
                                isLoading={isLoading}
                                color="primary"
                                type="submit"
                                isIconOnly
                                className="shadow-sm transition-all duration-200 ease-in-out"
                                isDisabled={!content.trim() || isOverLimit || isRetrying}
                                aria-label="Send message"
                                size="sm"
                            >
                                <IoIosSend className="text-lg" />
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
