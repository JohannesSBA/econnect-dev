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
import { FaPlus } from "react-icons/fa";

export default function App() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [school, setSchool] = useState<string>();
    const [degree, setDegree] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [GPA, setGpa] = useState<number>();
    const [major, setMajor] = useState<string>();
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [description, setDescription] = useState<string>();

    const handleSubmit = async (e: FormEvent<HTMLElement>) => {
        setLoading(true);
        toast.loading("Adding new Education");
        e.preventDefault();
        try {
            const res = await axios.post("/api/user/education/create", {
                school: school,
                degree: degree,
                GPA: GPA,
                major: major,
                startDate: startDate,
                endDate: endDate,
                description: description,
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error("axios error");
            }
            toast.error(error as string);
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
                className="m-2 h-[calc(100vh-4rem)] overflow-scroll"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="z-50 flex flex-col text-slate-800 font-bold text-4xl sticky border-b-1 bg-white border-slate-200 shadow-sm top-0">
                                Add new Education
                            </ModalHeader>
                            <form onSubmit={handleSubmit}>
                                <ModalBody className="flex flex-col gap-2 text-black">
                                    <p className="text-xs text-zinc-400 my-4">
                                        * Indicates required field
                                    </p>
                                    <Input
                                        isRequired
                                        label="School"
                                        className="my-2"
                                        placeholder="Ex: Addis Ababa University"
                                        labelPlacement="outside"
                                        onChange={(e) => {
                                            setSchool(e.target.value);
                                        }}
                                    />
                                    <Input
                                        isRequired
                                        label="Degree"
                                        placeholder="Ex: Bachelor's"
                                        labelPlacement="outside"
                                        className="my-2"
                                        onChange={(e) => {
                                            setDegree(e.target.value);
                                        }}
                                    />
                                    <Input
                                        isRequired
                                        label="Major"
                                        placeholder="Ex: Business administration"
                                        labelPlacement="outside"
                                        className="my-2"
                                        onChange={(e) => {
                                            setMajor(e.target.value);
                                        }}
                                    />
                                    <Input
                                        isRequired
                                        label="GPA"
                                        type="number"
                                        placeholder="GPA"
                                        labelPlacement="outside"
                                        className="my-2"
                                        onChange={(e) => {
                                            setGpa(Number(e.target.value));
                                        }}
                                    />
                                    <Textarea
                                        label="Description"
                                        labelPlacement="outside"
                                        placeholder="Enter your description"
                                        className="w-full text-black h-full"
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                        }}
                                    />
                                    <div className="flex gap-4">
                                        <Input
                                            isRequired
                                            label="Start Date"
                                            type="date"
                                            placeholder=" "
                                            labelPlacement="outside"
                                            className="my-2"
                                            onChange={(e) => {
                                                setStartDate(
                                                    new Date(e.target.value)
                                                );
                                            }}
                                        />
                                        <Input
                                            isRequired
                                            label="End Date"
                                            type="date"
                                            placeholder=" "
                                            labelPlacement="outside"
                                            className="my-2"
                                            onChange={(e) => {
                                                setEndDate(
                                                    new Date(e.target.value)
                                                );
                                            }}
                                        />
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="flat"
                                        onPress={onClose}
                                    >
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
