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
    Input,
} from "@nextui-org/react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { FiImage } from "react-icons/fi";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Tiptap from "./textEditor/Tiptap";
import { MdCancel, MdOutlineCancel } from "react-icons/md";

export default function CreatePost() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [title, setTitle] = useState<string>("");
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write something amazing...',
            }),
        ],
    });

    const handleSubmit = async (e: FormEvent<HTMLElement>) => {
        e.preventDefault();
        
        const postContent = editor?.getHTML() || "";
        
        if (!title.trim() || !postContent.trim()) {
            toast.error("Please fill in both title and post content");
            return;
        }

        toast.loading("Creating Post");
        const formData = new FormData();
        const imageId = Math.floor(Math.random() * 0xfffff * 1000000).toString(16);
        formData.append("Imageid", imageId);

        if (newImages && newImages.length > 0) {
            newImages.forEach((image, index) => {
                formData.append(`newPostImage${index}`, image);
            });
        }

        try {
            await axios.post("/api/user/post/create", {
                title: title,
                post: postContent,
                imageId: imageId,
            });

            if (newImages.length > 0) {
                await axios.post("/api/s3-upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            toast.dismiss();
            toast.success("Post Created");
            onOpenChange();
            window.location.reload();
        } catch (error) {
            toast.dismiss();
            toast.error("Error creating post");
            console.error(error);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        if (files.length > 3) {
            toast.error("Maximum 3 images allowed");
            return;
        }

        const filesArray = Array.from(files);
        setNewImages(filesArray);

        // Create preview URLs
        const previews = filesArray.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const removeImage = (index: number) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <>
            <Button
                onPress={onOpen}
                className="w-full md:w-96 h-12 mx-8 rounded-full bg-white hover:bg-gray-100 border-2 border-gray-200 shadow-sm transition-all flex items-center justify-between px-4"
            >
                <span className="font-medium text-gray-700">Create new post</span>
                <FiImage className="text-gray-500" size={20} />
            </Button>
            
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                size="4xl"
                className="light"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="border-b">
                                <h2 className="text-xl font-semibold text-gray-800">Create New Post</h2>
                            </ModalHeader>
                            <form onSubmit={handleSubmit}>
                                <ModalBody className="py-6 flex flex-col gap-4">
                                    <Input
                                        isRequired
                                        label="Title"
                                        labelPlacement="outside"
                                        placeholder="Enter an Engaging title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    
                                    <div className="prose max-w-none">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Post Content
                                        </label>
                                        

                                        <Tiptap 
                                            onChange={(content) => editor?.commands.setContent(content)}
                                            content={editor?.getHTML() || ""}
                                            onSendMessage={() => {}}
                                        />

                                    </div>

                                    <div className="mt-4">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={handleImageSelect}
                                        />

                                        
                                        
                                        <Button
                                            color="primary"
                                            variant="flat"
                                            className="w-full"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <FiImage className="mr-2" />
                                            Upload Images (Max 3)
                                        </Button>
                                        
                                        <div className="flex gap-4 mt-4 flex-wrap">
                                            {previewImages.map((image, index) => (
                                                <div key={index} className="relative">
                                                    <Image
                                                        src={image}
                                                        alt={`Preview ${index + 1}`}
                                                        width={200}
                                                        height={200}
                                                        className="rounded-lg object-cover"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        // color=""
                                                        variant="light"
                                                        className="absolute top-2 right-2"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <MdCancel size={20} />

                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </ModalBody>
                                
                                <ModalFooter className="border-t">
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                        className="mr-2"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        color="primary"
                                        type="submit"
                                        className="bg-blue-600 text-white"
                                    >
                                        Create Post
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
