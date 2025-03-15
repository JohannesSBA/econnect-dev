import { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";

interface TiptapProps {
    onChange: (content: string) => void;
    content: string;
    onSendMessage: () => void;
}

const Tiptap = ({ onChange, content, onSendMessage }: TiptapProps) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        editorProps: {
            attributes: {
                class: "prose prose-sm focus:outline-none max-w-none min-h-[100px] px-3 py-2",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Update editor when content changes from parent component
    useEffect(() => {
        // Only update if content is empty (after message sent) and editor exists
        if (editor && content === '' && editor.getHTML() !== '') {
            editor.commands.clearContent();
        }
    }, [content, editor]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent newline on Enter key
            onSendMessage(); // Trigger send message
            // Don't clear here, parent will handle it
        }
    }, [onSendMessage]);

    return (
        <div className="w-full border rounded-lg shadow-sm overflow-hidden transition-all duration-200 ease-in-out focus-within:shadow-md focus-within:border-indigo-300">
            <Toolbar editor={editor} content={content} />
            <EditorContent
                editor={editor}
                onKeyDown={handleKeyDown}
                className="text-base"
                aria-label="Message text editor"
            />
        </div>
    );
};

export default Tiptap;
