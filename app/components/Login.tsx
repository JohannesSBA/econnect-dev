import React, { FormEvent, useState } from "react";

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
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Login() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [password, setPassword] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [visible, setVisible] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

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

  async function loginWithCredentials(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    let res = await signIn("credentials", {
      email,
      password,
      callbackUrl: "https://localhost:3000/dashboard",
      redirect: false,
    });
    if (!res?.ok) {
      toast.error(res?.error);
    }
    if (res?.ok) {
      router.push("/dashboard");
    }
  }

  return (
    <>
      <Button onPress={onOpen} color="primary">
        Login
      </Button>
      <form onSubmit={loginWithCredentials}>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
          backdrop="blur"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Log in
                </ModalHeader>
                <ModalBody>
                  <form
                    className="flex flex-col gap-3"
                    onSubmit={loginWithCredentials}
                  >
                    <Input
                      endContent={<AiOutlineMail />}
                      required
                      label="Email"
                      placeholder="Enter your email"
                      variant="bordered"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                    <Input
                      endContent={<AiFillLock />}
                      required
                      label="Password"
                      placeholder="Enter your password"
                      type={visible ? "text" : "password"}
                      variant="bordered"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    <div className="flex py-2 px-1 justify-between">
                      <Checkbox
                        classNames={{
                          label: "text-small",
                        }}
                        onClick={() => setVisible(!visible)}
                      >
                        Show Password
                      </Checkbox>
                      <Link color="primary" href="#" size="sm">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="flex justify-end">
                      <Button color="danger" variant="flat" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" type="submit">
                        Sign in
                      </Button>
                    </div>
                  </form>
                </ModalBody>

                <ModalFooter></ModalFooter>
                <div className="px-4 pb-4 flex flex-col gap-2">
                  <Button
                    color="primary"
                    variant="bordered"
                    onPress={loginWithGoogle}
                  >
                    <FcGoogle />
                    Sign In With Google
                  </Button>
                  <Button
                    color="primary"
                    variant="bordered"
                    onPress={loginWithGitHub}
                  >
                    <AiOutlineGithub />
                    Sign In With Github
                  </Button>
                </div>
              </>
            )}
          </ModalContent>
        </Modal>
      </form>
    </>
  );
}
