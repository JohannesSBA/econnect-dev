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
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "sonner";
// import { useRouter } from "next/navigation";
import { CiImageOn } from "react-icons/ci";

interface ProfileImageProps {
  image: string;
}

const ProfileImage = ({ image }: ProfileImageProps) => {
  // const router = useRouter();
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
    }
  };

  return (
    <div className="flex justify-center flex-col items-center rounded-2xl">
      <div className="flex justify-center my-2">
        <Image
          src={image}
          alt="profile piture"
          width={350}
          height={350}
          className="border-4 max-h-40 w-full justify-center object-contain rounded-2xl"
        />
      </div>
      <Button
        onPress={onOpen}
        color="primary"
        variant="light"
        className="font-semibold flex p-4"
      >
        <CiImageOn />
        Change Profile picture
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
