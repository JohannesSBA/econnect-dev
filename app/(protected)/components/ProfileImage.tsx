"use client";
import React, { useState } from "react";
import {
  Button,
  Input,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Avatar,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
import { set } from "zod";

interface profileProps {
  id: string;
}

const ProfileImage = ({ id }: profileProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newImage, setNewImage] = useState<File | null | undefined>(null);
  const [previewImage, setPreviewImage] = useState<string>(
    `https://econnectbucket.s3.amazonaws.com/image/${id}`
  );

  if (!previewImage) {
    setPreviewImage("/avatar.png");
  }

  const formHandler = async () => {
    if (!newImage) {
      console.error("No image selected");
      toast.dismiss();
      return toast.error("No image Selected");
    } else {
      toast.loading("Uploading your image");
      setPreviewImage(URL.createObjectURL(newImage));
    }

    const formData = new FormData();
    formData.append("newImage", newImage, newImage.name);

    try {
      const response = await axios.post("/api/s3-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.dismiss();
    } catch (error) {
      toast.dismiss();
    } finally {
      toast.message("Image uploaded successfully");
      onOpenChange();
    }
  };

  return (
    <div className="flex justify-center flex-col items-center rounded-2xl">
      <div className="hidden md:flex justify-center p-8">
        <Button
          onPress={onOpen}
          color="primary"
          variant="light"
          className="w-full h-full"
        >
          <Avatar src={previewImage} className="w-40 h-40 text-6xl border-2" />
        </Button>
      </div>
      <div className="md:hidden flex justify-center">
        <Button
          onPress={onOpen}
          color="primary"
          variant="light"
          className="w-full h-full"
        >
          <Image
            src={previewImage}
            alt="profile piture"
            width={100}
            height={100}
            className="border-4 border-slate-400 justify-center object-contain rounded-full bg-slate-200"
          />
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        className="text-black"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload Picture
              </ModalHeader>
              <ModalBody className="p-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImage(e.target.files?.[0])}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={formHandler}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileImage;
