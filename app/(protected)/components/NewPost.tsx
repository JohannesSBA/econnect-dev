"use client";
import React, { FormEvent, useState } from "react";
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
  Link,
  Textarea,
} from "@nextui-org/react";
import { IoPencil } from "react-icons/io5";
import { IconContext } from "react-icons";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { FiImage } from "react-icons/fi";

export default function SignUp() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [post, setPost] = useState<string>();
  const [title, setTitle] = useState<string>();

  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    toast.loading("Creating Post");
    e.preventDefault();
    await axios.post("/api/user/post/create", {
      title: title,
      post: post,
    });
    try {
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("axios error");
      }
      toast.error(error as string);
    } finally {
      toast.dismiss();
      toast.success("Post Created");
      onOpenChange();
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        disableAnimation
        className=" w-[832px] h-16 mx-8 border rounded-full border-slate-300 bg-white flex gap-4 py-6 justify-between"
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
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black">
                Create New Post
              </ModalHeader>
              <form onSubmit={handleSubmit}>
                <ModalBody>
                  <Input
                    isRequired
                    label="Title"
                    labelPlacement="outside"
                    placeholder="Enter Title"
                    defaultValue={title as string}
                    className="w-full text-black h-full"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                  <Textarea
                    isRequired
                    label="Post"
                    labelPlacement="outside"
                    placeholder="Write your Post"
                    defaultValue={post as string}
                    className="w-full text-black h-full"
                    onChange={(e) => {
                      setPost(e.target.value);
                    }}
                    size="lg"
                  />
                  <div className="flex py-2 px-1 justify-between"></div>
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
