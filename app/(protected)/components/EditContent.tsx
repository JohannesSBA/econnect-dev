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
  const [education, setEducation] = useState<string>();
  const [country, setCountry] = useState<string>();
  const [city, setCity] = useState<string>();
  const location = country + ":" + city;

  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    await axios.put("/api/user/update", {
      bio: bio,
      name: fullName,
      pronouns: proNouns,
      location: location,
      education: education,
      currentPosition: currentPosition,
      title: title,
    });
    try {
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("axios error");
      }
      toast.error(error as string);
    } finally {
      onclose;
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="primary">
        <BiPencil />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        size="3xl"
        className=" m-2 h-screen"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col text-black font-bold text-4xl">
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
                      label="Education"
                      defaultValue={userEducation}
                      labelPlacement="outside"
                      onChange={(e) => {
                        setEducation(e.target.value);
                      }}
                    />
                  </div>
                  <h1 className="block">Location</h1>
                  <Input
                    isRequired
                    label="Country/Region"
                    defaultValue={userLocation.split(":").at(0)}
                    labelPlacement="outside"
                    onChange={(e) => {
                      setCountry(e.target.value);
                    }}
                  />
                  <Input
                    isRequired
                    label="City"
                    defaultValue={userLocation.split(":").at(1)}
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
    </>
  );
}
