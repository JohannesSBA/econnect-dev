import React, {
    FormEvent,
    FormEventHandler,
    SyntheticEvent,
    useState,
} from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Checkbox,
    Input,
    Link,
} from "@nextui-org/react";
import { AiOutlineMail, AiFillLock, AiOutlineGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

interface regValues {
    name: string;
    email: string;
    password: string;
}

export default function Login() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [password, setPassword] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [name, setName] = useState<string>();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function loginWithGoogle() {
        setIsLoading(true);
        try {
            await signIn("google");
        } catch (error) {
            // display error message to user
            console.error("Something went wrong with your login.");
        } finally {
            setIsLoading(false);
        }
    }

    async function loginWithGitHub() {
        setIsLoading(true);
        try {
            await signIn("github");
        } catch (error) {
            // display error message to user
            console.error("Something went wrong with your login.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();
        if (password !== confirmPassword) {
            throw new Error("bad pass");
        } else {
            let userData: regValues = {
                name: name as string,
                email: email as string,
                password: password as string,
            };

            // Make call to backend to create user
            const res = await fetch("http://localhost:3000/lib/register", {
                method: "POST",
                body: JSON.stringify(userData),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();

                // registration success
            } else {
                //registration faled
            }
        }
    }
    return (
        <>
            <Button onPress={onOpen} color="primary" variant="flat">
                Sign Up
            </Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                backdrop="blur"
                onSubmit={handleSubmit}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Sign Up
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    label="text"
                                    placeholder="Enter your Name"
                                    variant="bordered"
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                />
                                <Input
                                    endContent={<AiOutlineMail />}
                                    label="Email"
                                    placeholder="Enter your email"
                                    variant="bordered"
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                />
                                <Input
                                    endContent={<AiFillLock />}
                                    label="Password"
                                    placeholder="Enter your password"
                                    type="password"
                                    variant="bordered"
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                />
                                <Input
                                    endContent={<AiFillLock />}
                                    label="Confirm"
                                    placeholder="Confirm your password"
                                    type="password"
                                    variant="bordered"
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                    }}
                                />
                                <div className="flex py-2 px-1 justify-between">
                                    <Checkbox
                                        classNames={{
                                            label: "text-small",
                                        }}
                                    >
                                        Remember me
                                    </Checkbox>
                                    <Link color="primary" href="#" size="sm">
                                        Forgot password?
                                    </Link>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                                <Button type="submit" color="primary">
                                    Sign up
                                </Button>
                            </ModalFooter>
                            <div className="px-4 pb-4 flex flex-col gap-2">
                                <Button
                                    color="primary"
                                    variant="bordered"
                                    onPress={loginWithGoogle}
                                >
                                    <FcGoogle />
                                    Sign Up With Google
                                </Button>
                                <Button
                                    color="primary"
                                    variant="bordered"
                                    onPress={loginWithGitHub}
                                >
                                    <AiOutlineGithub />
                                    Sign Up With Github
                                </Button>
                            </div>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
