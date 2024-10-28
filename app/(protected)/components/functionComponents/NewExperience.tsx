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
  Radio,
  Checkbox,
} from "@nextui-org/react";
import { BiPencil } from "react-icons/bi";
import { userProps } from "@/app/types/db";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { FaPlus } from "react-icons/fa";

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState<string>();
  const [employmentType, setEmploymentType] = useState<string>("Full-time");
  const [companyName, setcompanyName] = useState<string>();
  const [locationName, setLocationName] = useState<string>();
  const [locationType, setLocationType] = useState<string>("On-Site");
  const [currently, setCurrently] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [description, setDescription] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    setLoading(true);
    toast.loading("Adding new Experience");
    e.preventDefault();
    try {
      const res = await axios.post("/api/user/experience/create", {
        title: title,
        EmploymentType: employmentType,
        CompanyName: companyName,
        LocationName: locationName,
        LocationType: locationType,
        currently: currently,
        startDate: startDate,
        endDate: endDate,
        Description: description,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message.toString());
      } // Render the error message instead of the entire error object
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <div className="z-50">
      <Button onPress={onOpen} color="primary" variant="light" isIconOnly>
        <FaPlus />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        size="3xl"
        className="m-2 h-[calc(100vh-4rem)] overflow-scroll light"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="z-50 flex flex-col text-slate-800 font-bold text-4xl sticky border-b-1 bg-white border-slate-200 shadow-sm top-0">
                Add new Experience
              </ModalHeader>
              <form onSubmit={handleSubmit}>
                <ModalBody className="flex flex-col gap-2 text-black">
                  <p className="text-xs text-zinc-400 my-4">
                    * Indicates required field
                  </p>
                  <Input
                    isRequired
                    label="Title"
                    className="my-2"
                    placeholder="Ex: Software Engineer"
                    labelPlacement="outside"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="bordered"
                        size="sm"
                        className="rounded-md"
                      >
                        {employmentType}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      variant="flat"
                      aria-label="Dropdown menu with shortcut"
                      className="text-black align-start"
                    >
                      <DropdownItem
                        onClick={() => {
                          setEmploymentType("Full-time");
                        }}
                      >
                        Full-Time
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setEmploymentType("Part-time");
                        }}
                      >
                        Part-Time
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setEmploymentType("Self-Employed");
                        }}
                      >
                        Self-Employed
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setEmploymentType("Freelance");
                        }}
                      >
                        Freelance
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setEmploymentType("Internship");
                        }}
                      >
                        Internship
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <Input
                    isRequired
                    label="Company"
                    placeholder="Ex: Google"
                    labelPlacement="outside"
                    className="my-2"
                    onChange={(e) => {
                      setcompanyName(e.target.value);
                    }}
                  />
                  <Input
                    isRequired
                    label="Location"
                    placeholder="Ex: Addis Ababa"
                    labelPlacement="outside"
                    className="my-2"
                    onChange={(e) => {
                      setLocationName(e.target.value);
                    }}
                  />
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="bordered"
                        size="sm"
                        className="rounded-md"
                      >
                        {locationType}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      variant="flat"
                      aria-label="Dropdown menu with shortcut"
                      className="text-black align-start"
                    >
                      <DropdownItem
                        onClick={() => {
                          setLocationType("On-Site");
                        }}
                      >
                        On-Site
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setLocationType("Hybrid");
                        }}
                      >
                        Hybrid
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          setLocationType("Remote");
                        }}
                      >
                        Remote
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <Textarea
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Enter your description"
                    className="w-full text-black h-full"
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                  <h1 className="pt-4 text-bold flex gap-2">
                    Are Your current Still Working here?
                    <Checkbox
                      isSelected={currently}
                      onValueChange={setCurrently}
                    ></Checkbox>
                  </h1>
                  <div className="flex gap-4">
                    <Input
                      isRequired
                      label="Start Date"
                      type="date"
                      placeholder=" "
                      labelPlacement="outside"
                      className="my-2"
                      onChange={(e) => {
                        setStartDate(new Date(e.target.value));
                      }}
                    />
                    <Input
                      isRequired
                      label="End Date"
                      type="date"
                      placeholder=" "
                      labelPlacement="outside"
                      disabled={currently}
                      className="my-2"
                      onChange={(e) => {
                        setEndDate(new Date(e.target.value));
                      }}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  {loading ? (
                    <Button>Loading...</Button>
                  ) : (
                    <Button color="primary" type="submit">
                      Submit
                    </Button>
                  )}
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
