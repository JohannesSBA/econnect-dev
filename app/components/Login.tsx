import React, {useState} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import {AiOutlineMail, AiFillLock, AiOutlineGithub} from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc'
import { signIn } from "next-auth/react";

export default function Login() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

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

  return (
    <>
      <Button onPress={onOpen} color="primary">Login</Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>
                <Input
                  endContent={
                    <AiOutlineMail />
                  }
                  label="Email"
                  placeholder="Enter your email"
                  variant="bordered"
                /> 
                <Input
                  endContent={
                    <AiFillLock />
                  }
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
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
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Sign in
                </Button>
                
              </ModalFooter>
              <div className="px-4 pb-4 flex flex-col gap-2">
              <Button color="primary" variant="bordered" onPress={loginWithGoogle}>
                <FcGoogle />
                  Sign In With Google
                </Button>
                <Button color="primary" variant="bordered" onPress={loginWithGitHub}>
                <AiOutlineGithub />
                  Sign In With Github
                </Button>
              </div>
              
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
