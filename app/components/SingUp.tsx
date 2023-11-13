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
import validateCredentials from "../helpers/validateForm";
import axios from "axios";
import { toast } from "sonner";

export default function SignUp() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [email, setEmail] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [name, setName] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [ConfirmPassword, setConfirmPassword] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [visible, setVisible] = useState<boolean>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  function passWordMatch(password: string, confirmedPassword: string) {
    if (password === confirmedPassword) {
      return true;
    } else {
      return false;
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO Refresh page when User signs up

    if (!passWordMatch(password as string, ConfirmPassword as string)) {
      toast.error("Password Do not Match");
      return;
    } else {
      const validated = validateCredentials(
        email as string,
        password as string
      );
      if (validated.success === true) {
        const res = await axios.post("/api/user/register", {
          email: email,
          name: name,
          id: userName,
          password: password,
          phoneNumber: phoneNumber,
        });
        if (res.status) {
          const data = await res.data;
          const lastWord = data.split(" ").pop();
          if (lastWord === "(`email`)") {
            toast.error("Email is Already in use");
          }
        } else {
          toast(res.data);
        }
      }
    }
  };

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
              <ModalHeader className="flex flex-col gap-1">Sign Up</ModalHeader>
              <ModalBody>
                <form className="flex flex-col gap-3">
                  <Input
                    label="Name"
                    placeholder="Enter your Name"
                    type="text"
                    variant="bordered"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  <Input
                    endContent={<AiOutlineMail />}
                    label="Email"
                    placeholder="Enter your email"
                    type="email"
                    variant="bordered"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <Input
                    label="UserName"
                    placeholder="Enter your user name"
                    variant="bordered"
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                  />
                  <Input
                    endContent={<AiFillLock />}
                    label="Password"
                    placeholder="Enter your password"
                    type={visible ? "password" : "text"}
                    variant="bordered"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <Input
                    endContent={<AiFillLock />}
                    label="Confirm"
                    placeholder="Confirm your password"
                    type={visible ? "password" : "text"}
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
                      onClick={() => setVisible(!visible)}
                    >
                      Show Password
                    </Checkbox>
                    <Link color="primary" href="#" size="sm">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="w-full flex justify-end gap-4 mr-2">
                    <Button type="submit" color="primary">
                      Sign up
                    </Button>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Close
                    </Button>
                  </div>
                </form>
              </ModalBody>
              <ModalFooter></ModalFooter>
              {/* <div className="px-4 pb-4 flex flex-col gap-2">
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
              </div> */}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
