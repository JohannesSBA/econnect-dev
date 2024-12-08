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
        content, // Set the initial content
        editorProps: {
            attributes: {
                class: "prose prose-sm focus:outline-none max-w-none",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent newline on Enter key
            onSendMessage(); // Trigger send message
            clearEditorContent(); // Clear the editor content after sending
        }
    };

    const clearEditorContent = () => {
        // Clear the editor's content after sending the message
        if (editor) {
            editor.commands.clearContent();
        }
    };

    return (
        <div className="w-full border rounded-md">
            <Toolbar editor={editor} content={content} />
            <EditorContent
                editor={editor}
                onKeyDown={handleKeyDown} // Attach onKeyDown to handle keypress events
            />
        </div>
    );
};

export default Tiptap;
