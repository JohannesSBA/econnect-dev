"use client";
import React, { FormEvent, useReducer, useState } from "react";
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
import { useRouter } from "next/router";

export default function App({
  userBio,
  userName,
  userPronouns,
  userLocation,
  userEducation,
  userCPosition,
  userTitle,
}: userProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const fullName = firstName + " " + lastName;
  const [proNouns, setPronouns] = useState<string>("Select one");
  const [bio, setBio] = useState<string>();
  const [title, setTitle] = useState<string>();
  const [currentPosition, setPosition] = useState<string>();

  const [educationGPA, setEducationGPA] = useState<number>();
  const [educationMajor, setEducationMajor] = useState<string>();
  const [educationSchool, setEducationSchool] = useState<string>();
  const [educationDegree, setEducationDegree] = useState<string>();

  const [country, setCountry] = useState<string>();
  const [city, setCity] = useState<string>();
  const location = country + ":" + city;

  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      const res = await axios.put("/api/user/update", {
        bio: bio,
        firstName: firstName,
        lastName: lastName,
        pronouns: proNouns,
        location: location,
        education: [
          {
            gpa: educationGPA,
            major: educationMajor,
            school: educationSchool,
            degree: educationDegree,
          },
        ],
        currentPosition: currentPosition,
        title: title,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("axios error");
      }
      toast.error(error as string);
    } finally {
      // window.location.reload();
    }
  };

  return (
    <div className="z-50">
      <Button onPress={onOpen} color="primary" variant="ghost">
        <BiPencil />
        <h1>Edit Content</h1>
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        size="3xl"
        className="m-2 h-[calc(100vh-4rem)] overflow-scroll"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="z-50 flex flex-col text-slate-800 font-bold text-4xl sticky border-b-1 bg-white border-slate-200 shadow-sm top-0">
                Edit Content
              </ModalHeader>
              <form onSubmit={handleSubmit}>
                <ModalBody className="flex flex-col gap-6 text-black">
                  <p className="text-xs text-zinc-400 my-4">
                    * Indicates required field
                  </p>
                  <div className="flex gap-4">
                    <Input
                      isRequired
                      label="First Name"
                      defaultValue={userName.split(":").at(0)}
                      labelPlacement="outside"
                      onChange={(e) => {
                        setFirstName(e.target.value);
                      }}
                    />
                    <Input
                      isRequired
                      label="Last Name"
                      defaultValue={userName.split(":").at(1)}
                      labelPlacement="outside"
                      onChange={(e) => {
                        setLastName(e.target.value);
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
                        {proNouns}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      variant="flat"
                      aria-label="Dropdown menu with shortcut"
                      className="text-black align-start"
                    >
                      <DropdownItem
                        onClick={() => {
                          setPronouns("He/Him");
                        }}
                      >
                        He/Him
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setPronouns("She/Her");
                        }}
                      >
                        She/Her
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setPronouns("Other");
                        }}
                      >
                        Other
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <Textarea
                    isRequired
                    label="About"
                    labelPlacement="outside"
                    placeholder="Enter your description"
                    defaultValue={userBio as string}
                    className="w-full text-black h-full"
                    onChange={(e) => {
                      setBio(e.target.value);
                    }}
                  />
                  <h1 className="block">Occuptation</h1>
                  <Input
                    isRequired
                    label="Title"
                    defaultValue={userTitle}
                    labelPlacement="outside"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                  <div className="flex gap-4">
                    <Input
                      isRequired
                      label="Current Position"
                      defaultValue={userCPosition}
                      labelPlacement="outside"
                      onChange={(e) => {
                        setPosition(e.target.value);
                      }}
                    />
                    <Input
                      isRequired
                      label="School"
                      labelPlacement="outside"
                      onChange={(e) => {
                        setEducationSchool(e.target.value);
                      }}
                    />
                    <Input
                      isRequired
                      label="Degree"
                      labelPlacement="outside"
                      onChange={(e) => {
                        setEducationDegree(e.target.value);
                      }}
                    />
                    <Input
                      isRequired
                      label="Major"
                      labelPlacement="outside"
                      onChange={(e) => {
                        setEducationMajor(e.target.value);
                      }}
                    />
                    <Input
                      isRequired
                      type="number"
                      label="GPA"
                      labelPlacement="outside"
                      onChange={(e) => {
                        setEducationGPA(parseFloat(e.target.value));
                      }}
                    />
                  </div>
                  <h1 className="block">Location</h1>
                  <Input
                    isRequired
                    label="Country/Region"
                    defaultValue={
                      userLocation !== null ? userLocation.split(":").at(0) : ""
                    }
                    labelPlacement="outside"
                    onChange={(e) => {
                      setCountry(e.target.value);
                    }}
                  />
                  <Input
                    isRequired
                    label="City"
                    defaultValue={
                      userLocation !== null ? userLocation.split(":").at(0) : ""
                    }
                    labelPlacement="outside"
                    onChange={(e) => {
                      setCity(e.target.value);
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
}
