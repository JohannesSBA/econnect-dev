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
import { CiImageOn } from "react-icons/ci";

const ProfileImage = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newImage, setNewImage] = useState<File | null | undefined>(null);
  const [previewImage, setPreviewImage] = useState<string>("/user-avatar.png");

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
      <div className="hidden md:flex justify-center">
        <Image
          src={previewImage}
          alt="profile piture"
          width={250}
          height={250}
          className="border-4 border-slate-400 justify-center object-contain rounded-full bg-slate-200"
        />
      </div>
      <div className="md:hidden flex justify-center">
        <Image
          src={previewImage}
          alt="profile piture"
          width={100}
          height={100}
          className="border-4 border-slate-400 justify-center object-contain rounded-full bg-slate-200"
        />
      </div>
      <Button
        onPress={onOpen}
        color="primary"
        variant="light"
        className="font-semibold flex p-4 text-xs md:text-base"
      >
        <CiImageOn />
        Change Profile picture
      </Button>
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
