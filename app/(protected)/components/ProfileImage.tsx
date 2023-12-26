"use client";
import React, { useState } from "react";
import {
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";

interface ProfileImageProps {
  image: string;
}

const ProfileImage = ({ image }: ProfileImageProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newImage, setNewImage] = useState<File | null | undefined>(null);
  // const [previewImage, setPreviewImage] = useState<string | null>(null);

  const formHandler = async () => {
    toast.loading("Uploading your image");
    if (!newImage) {
      console.error("No image selected");
      toast.dismiss();
      return toast.error("No image Selected");
    }

    const formData = new FormData();
    formData.append("newImage", newImage);

    try {
      const response = await axios.post("/api/s3-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Image uploaded successfully:", response.data);
      toast.dismiss();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.dismiss();
    }
  };

  return (
    <div>
      <Button
        onPress={onOpen}
        className="w-fit h-fit bg-transparent flex justify-center border-2 border-black"
      >
        <Image
          src={image}
          alt="NextUI Album Cover"
          className="rounded-full border-4"
        />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        className="text-black"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload Picture
              </ModalHeader>
              <ModalBody>
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
