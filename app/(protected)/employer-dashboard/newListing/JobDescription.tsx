import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import MenuBar from "./MenuBar";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";

interface JobDescriptionProps {
  initialContent?: string;
  setShortDescriptions: (description: string) => void;
  setAbout: (description: string) => void;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ 
  initialContent = "",
  setShortDescriptions, 
  setAbout 
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Placeholder.configure({
        placeholder: "Write the job description here...",
        showOnlyWhenEditable: false,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setShortDescriptions(html);
      setAbout(html);
    },
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Job Description
      </h2>
      <div className="mt-2 w-full">
        <MenuBar editor={editor} />
        <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[200px] border rounded-md p-4 mt-2">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default JobDescription;