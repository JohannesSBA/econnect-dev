"use client";
import { FunctionComponent, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import axios from "axios";
import { IoIosSend } from "react-icons/io";
import { Button } from "@nextui-org/react";
import { toast } from "sonner";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

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
    const { editor } = useCurrentEditor();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [input, setInput] = useState<string>();

    const sendMessage = async () => {
        if (!input) return;
        setIsLoading(true);
        try {
            await axios.post("/api/message/send", {
                text: input,
                chatId: chatId,
                chatPartner: chatPartner,
                chatRoom: chatRoom,
            });
            setInput("");
            textareaRef.current?.focus();
        } catch {
            toast.error("Something went wrong. Please try again later");
        } finally {
            setIsLoading(false);
        }
    };

    const MenuBar = () => {
        const { editor } = useCurrentEditor();
        if (!editor) {
            return null;
        }
        setInput(editor.getHTML());
        return (
            <div className="text-black shadow-md p-2 bg-white flex gap-2">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`px-3 py-1 rounded ${
                        editor.isActive("bold") ? "bg-gray-300" : ""
                    }`}
                >
                    B
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={
                        !editor.can().chain().focus().toggleItalic().run()
                    }
                    className={`px-3 py-1 rounded ${
                        editor.isActive("italic") ? "bg-gray-300" : ""
                    }`}
                >
                    Italic
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={
                        !editor.can().chain().focus().toggleStrike().run()
                    }
                    className={`px-3 py-1 rounded ${
                        editor.isActive("strike") ? "bg-gray-300" : ""
                    }`}
                >
                    strike
                </button>

                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                >
                    undo
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                >
                    redo
                </button>
            </div>
        );
    };

    const extensions = [
        StarterKit.configure({
            bulletList: {
                keepMarks: true,
                keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
            },
            orderedList: {
                keepMarks: true,
                keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
            },
        }),
    ];

    return (
        <div className="border-t border-gray-200 px-4 py-4 mb-2 sm:mb-0">
            <div className="text-black relative flex-1 overlow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-blue-600">
                <EditorProvider
                    slotBefore={<MenuBar />}
                    extensions={extensions}
                ></EditorProvider>

                <div
                    onClick={() => textareaRef.current?.focus()}
                    className="py-2"
                    aria-hidden="true"
                >
                    <div className="py-px">
                        <div className="h-9"></div>
                    </div>
                </div>

                <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                    <div className="flex-shrink-0">
                        <Button
                            onClick={sendMessage}
                            isLoading={isLoading}
                            color="primary"
                            type="submit"
                            isIconOnly
                        >
                            <IoIosSend />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
