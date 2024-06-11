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
  Textarea,
  Input,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { BiPencil } from "react-icons/bi";
import { userProps } from "@/app/types/db";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { IoIosAdd } from "react-icons/io";

interface NewJobListingProps {
  id: string;
}

const NewJobListing: React.FC<NewJobListingProps> = ({ id }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [shortDescription, setShortDescription] = useState<string>();
  const [jobType, setJobType] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [about, setAbout] = useState<string>();

  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    await axios.post("/api/job/create", {
      title: title,
      descrption: description,
      shortDescription: shortDescription,
      about: about,
      jobType: jobType,
      location: location,
    });
    try {
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("axios error");
      }
      toast.error(error as string);
    } finally {
      window.location.reload();
    }
  };

  return (
    <div className="z-50">
      <div
        onClick={onOpen}
        className="rounded-lg bg-green-500 p-8 m-2 w-72 h-32 shadow-md flex items-center text-slate-100 group"
      >
        <span className="rounded-full h-12 w-12 group-hover:bg-white text-white group-hover:text-black flex items-center justify-center mx-3">
          <IoIosAdd />
        </span>
        New Listing
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        size="3xl"
        className="m-2 h-screen overflow-scroll"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col text-black font-bold text-4xl">
                Create New Job Listing
              </ModalHeader>
              <form onSubmit={handleSubmit}>
                <ModalBody className="flex flex-col gap-6 text-black">
                  <p className="text-xs text-zinc-400 my-4">
                    * Indicates required field
                  </p>
                  <div className="flex gap-4">
                    <Input
                      isRequired
                      label="Title"
                      labelPlacement="outside"
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    />
                    <Input
                      isRequired
                      label="Short Description"
                      labelPlacement="outside"
                      onChange={(e) => {
                        setShortDescription(e.target.value);
                      }}
                    />
                    <Input
                      isRequired
                      label="Description"
                      labelPlacement="outside"
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
                  </div>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="bordered"
                        size="sm"
                        className="rounded-md"
                      >
                        {jobType ? jobType : "Job Type"}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      variant="flat"
                      aria-label="Dropdown menu with shortcut"
                      className="text-black align-start"
                    >
                      <DropdownItem
                        onClick={() => {
                          setJobType("Remote");
                        }}
                      >
                        Remote
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setJobType("Hybrid");
                        }}
                      >
                        Hybrid
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setJobType("In-Person");
                        }}
                      >
                        In-Person
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <Textarea
                    isRequired
                    label="About"
                    labelPlacement="outside"
                    placeholder="Enter your description"
                    className="w-full text-black h-full"
                    onChange={(e) => {
                      setAbout(e.target.value);
                    }}
                  />
                  <h1 className="block">Location</h1>
                  <Input
                    isRequired
                    label="City"
                    labelPlacement="outside"
                    onChange={(e) => {
                      setLocation(e.target.value);
                    }}
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
    </div>
  );
};

export default NewJobListing;
