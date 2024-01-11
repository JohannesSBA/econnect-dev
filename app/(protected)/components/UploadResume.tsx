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

const UploadResume = () => {
  // const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newResume, setNewResume] = useState<File | null | undefined>(null);
  // const [previewImage, setPreviewImage] = useState<string | null>(null);

  const formHandler = async () => {
    toast.loading("Uploading your Resume");
    if (!newResume) {
      console.error("No File selected");
      toast.dismiss();
      return toast.error("No File Selected");
    }

    const formData = new FormData();
    formData.append("newResume", newResume, newResume.name);

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
    <div className="w-full flex justify-center flex-col items-center rounded-2xl">
      <Button
        onPress={onOpen}
        color="primary"
        variant="light"
        className="font-semibold flex"
      >
        <CiImageOn />
        Upload Your Resume
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
                Upload Resume
              </ModalHeader>
              <ModalBody>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setNewResume(e.target.files?.[0])}
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

export default UploadResume;
