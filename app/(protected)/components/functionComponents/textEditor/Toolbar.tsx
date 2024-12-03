import React from "react";
import { type Editor } from "@tiptap/react";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
} from "lucide-react";
type Props = {
    editor: Editor | null;
    content: string;
};
const Toolbar = ({ editor }: Props) => {
    if (!editor) return null;
    const buttonClasses = (isActive: boolean) =>
        isActive
            ? "bg-indigo-600 text-white p-2 rounded-md"
            : "text-black hover:bg-indigo-100 p-2 rounded-md";
    return (
        <div className="flex justify-between items-center px-3 py-2 bg-gray-100 border-b">
            <div className="flex gap-2">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleBold().run();
                    }}
                    className={buttonClasses(editor.isActive("bold"))}
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleItalic().run();
                    }}
                    className={buttonClasses(editor.isActive("italic"))}
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleBulletList().run();
                    }}
                    className={buttonClasses(editor.isActive("bulletList"))}
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleOrderedList().run();
                    }}
                    className={buttonClasses(editor.isActive("orderedList"))}
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleBlockquote().run();
                    }}
                    className={buttonClasses(editor.isActive("blockquote"))}
                >
                    <Quote className="w-4 h-4" />
                </button>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().undo().run();
                    }}
                    className={buttonClasses(false)}
                >
                    <Undo className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().redo().run();
                    }}
                    className={buttonClasses(false)}
                >
                    <Redo className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
export default Toolbar;
