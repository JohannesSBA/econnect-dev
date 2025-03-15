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
    Code,
} from "lucide-react";

type Props = {
    editor: Editor | null;
    content: string;
};

const Toolbar = ({ editor }: Props) => {
    if (!editor) return null;
    
    const buttonClasses = (isActive: boolean) =>
        `${isActive 
            ? "bg-primary text-white" 
            : "text-gray-700 hover:bg-gray-100"} 
            p-1.5 rounded-md transition-colors duration-200 ease-in-out`;
    
    return (
        <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border-b">
            <div className="flex gap-1 flex-wrap">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleBold().run();
                    }}
                    className={buttonClasses(editor.isActive("bold"))}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleItalic().run();
                    }}
                    className={buttonClasses(editor.isActive("italic"))}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleBulletList().run();
                    }}
                    className={buttonClasses(editor.isActive("bulletList"))}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleOrderedList().run();
                    }}
                    className={buttonClasses(editor.isActive("orderedList"))}
                    title="Numbered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleBlockquote().run();
                    }}
                    className={buttonClasses(editor.isActive("blockquote"))}
                    title="Quote"
                >
                    <Quote className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().toggleCodeBlock().run();
                    }}
                    className={buttonClasses(editor.isActive("codeBlock"))}
                    title="Code Block"
                >
                    <Code className="w-4 h-4" />
                </button>
            </div>
            <div className="flex gap-1">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().undo().run();
                    }}
                    className={buttonClasses(false)}
                    disabled={!editor.can().undo()}
                    title="Undo"
                >
                    <Undo className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        editor.chain().focus().redo().run();
                    }}
                    className={buttonClasses(false)}
                    disabled={!editor.can().redo()}
                    title="Redo"
                >
                    <Redo className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
