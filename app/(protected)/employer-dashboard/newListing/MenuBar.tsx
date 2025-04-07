import React from "react";
import { useCurrentEditor } from "@tiptap/react";
import { Editor } from '@tiptap/core';

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) return null;

  const handleButtonClick = (action: () => void) => {
    action();
  };

  return (
    <div className="text-black shadow-md p-2 bg-white flex gap-2 mb-4">
      <button
        onClick={() => handleButtonClick(() => editor.chain().focus().toggleBold().run())}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-3 py-1 rounded ${editor.isActive("bold") ? "bg-gray-300" : ""}`}
      >
        B
      </button>
      <button
        onClick={() => handleButtonClick(() => editor.chain().focus().toggleItalic().run())}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-3 py-1 rounded ${editor.isActive("italic") ? "bg-gray-300" : ""}`}
      >
        Italic
      </button>
      <button
        onClick={() => handleButtonClick(() => editor.chain().focus().toggleStrike().run())}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`px-3 py-1 rounded ${editor.isActive("strike") ? "bg-gray-300" : ""}`}
      >
        Strike
      </button>
      <button onClick={() => handleButtonClick(() => editor.chain().focus().undo().run())}>Undo</button>
      <button onClick={() => handleButtonClick(() => editor.chain().focus().redo().run())}>Redo</button>
    </div>
  );
};

export default MenuBar; 