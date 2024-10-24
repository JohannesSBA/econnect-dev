"use client";
import React, { FormEvent, useState } from "react";
import "@/app/rich.css";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
} from "@nextui-org/react";
import Image from "next/image";
import TextStyle from "@tiptap/extension-text";
import ListItem from "@tiptap/extension-list-item";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { FiImage } from "react-icons/fi";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function CreatePost() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [post, setPost] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    toast.loading("Creating Post");
    e.preventDefault();
    const formData = new FormData();
    const imageId = Math.floor(Math.random() * 0xfffff * 1000000).toString(16);
    formData.append("Imageid", imageId);

    if (newImages && newImages.length > 0) {
      newImages.forEach((image, index) => {
        formData.append(`newPostImage${index}`, image, image.name);
      });
      setPreviewImages(newImages.map((image) => URL.createObjectURL(image)));
    }

    try {
      await axios.post("/api/user/post/create", {
        title: title,
        post: post,
        imageId: imageId,
      });
      await axios.post("/api/s3-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.dismiss();
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.error("Received invalid JSON from server");
      } else {
        toast.error("Error");
      }
    } finally {
      toast.dismiss();
      toast.success("Post Created");
      onOpenChange();
      window.location.reload();
    }
  };

  const MenuBar = () => {
    const { editor } = useCurrentEditor();
    if (!editor) {
      return null;
    }
    setPost(editor.getHTML());
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
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("italic") ? "bg-gray-300" : ""
          }`}
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("strike") ? "bg-gray-300" : ""
          }`}
        >
          <s>strike</s>
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("paragraph") ? "bg-gray-300" : ""
          }`}
        >
          p
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-3 py-1 rounded ${
            editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""
          }`}
        >
          h1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-3 py-1 rounded ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""
          }`}
        >
          h2
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("bulletList") ? "bg-gray-300" : ""
          }`}
        >
          bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("orderedList") ? "bg-gray-300" : ""
          }`}
        >
          ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("blockquote") ? "bg-gray-300" : ""
          }`}
        >
          blockquote
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
    TextStyle.configure({ types: [ListItem.name] }),
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
    <>
      <Button
        onPress={onOpen}
        disableAnimation
        className=" w-full h-16 mx-8 border rounded-full border-slate-300 bg-white flex gap-4 py-6 justify-between"
      >
        <h1 className="font-PlusJakartaSans ml-2 text-base text-[#676667]">
          Create new Post
        </h1>
        <FiImage />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top"
        size="5xl"
        className="light"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black">
                Create New Post
              </ModalHeader>
              <form onSubmit={handleSubmit} className="text-black">
                <ModalBody>
                  <Input
                    isRequired
                    label="Title"
                    labelPlacement="outside"
                    placeholder="Enter Title"
                    defaultValue={title as string}
                    className="w-full text-black h-full m-2"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                  <h1 className="text-sm">Write your Post here</h1>
                  <div className="bg-[#f4f4f5] m-2 h-72 overflow-visible rounded-md">
                    <EditorProvider
                      slotBefore={<MenuBar />}
                      extensions={extensions}
                    ></EditorProvider>
                  </div>
                  <div className="flex py-2 px-1 justify-between"></div>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple // Allow multiple files to be selected
                    max={3}
                    onChange={(e) => {
                      if (e.target.files) {
                        const fileArray = Array.from(e.target.files);
                        if (fileArray.length > 3) {
                          toast.error("You can only upload 3 images at a time");
                          return;
                        }
                        setNewImages(fileArray); // Update state with an array of files
                        setPreviewImages(
                          fileArray.map((file) => URL.createObjectURL(file))
                        ); // Create URLs for preview
                      }
                    }}
                  />
                  <div className="flex gap-4">
                    {previewImages.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt="preview"
                        width={200}
                        height={200}
                      />
                    ))}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit">
                    Submit
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
