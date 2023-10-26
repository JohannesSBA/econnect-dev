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

interface formValues {
  email: string;
  password: string;
}

export default function Login() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [password, setPassword] = useState<string>();
  const [email, setEmail] = useState<string>();

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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      let userData: formValues = {
          email: email as string,
          password: password as string,
      };

      // Make call to backend to create user
      console.log('p')
      const res = await fetch('http://127.0.0.1:3000/dashboard/api/user/login', {
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
  return (
      <>
          <form onSubmit={handleSubmit}>
              <input
                  type="text"
                  placeholder="name"
                  onChange={(e) => {
                      setEmail(e.target.value);
                  }}
              />
              <input
                  type="password"
                  placeholder="password"
                  onChange={(e) => {
                      setPassword(e.target.value);
                  }}
              />
              <Button type="submit">si</Button>
          </form>
      </>
  );
}

// <Button onPress={onOpen} color="primary">
// Login
// </Button>
// <form onSubmit={handleSubmit}>
//     <Modal
//         isOpen={isOpen}
//         onOpenChange={onOpenChange}
//         placement="top-center"
//         backdrop="blur"
//     >
//         <ModalContent>
//             {(onClose) => (
//                 <>
//                     <ModalHeader className="flex flex-col gap-1">
//                         Log in
//                     </ModalHeader>
//                     <ModalBody>
//                         <Input
//                             endContent={<AiOutlineMail />}
//                             label="Email"
//                             placeholder="Enter your email"
//                             variant="bordered"
//                             onChange={(e) => {
//                                 setEmail(e.target.value);
//                             }}
//                         />
//                         <Input
//                             endContent={<AiFillLock />}
//                             label="Password"
//                             placeholder="Enter your password"
//                             type="password"
//                             variant="bordered"
//                             onChange={(e) => {
//                                 setPassword(e.target.value);
//                             }}
//                         />
//                         <div className="flex py-2 px-1 justify-between">
//                             <Checkbox
//                                 classNames={{
//                                     label: "text-small",
//                                 }}
//                             >
//                                 Remember me
//                             </Checkbox>
//                             <Link
//                                 color="primary"
//                                 href="#"
//                                 size="sm"
//                             >
//                                 Forgot password?
//                             </Link>
//                         </div>
//                     </ModalBody>
//                     <ModalFooter>
//                         <Button
//                             color="danger"
//                             variant="flat"
//                             onPress={onClose}
//                         >
//                             Close
//                         </Button>
//                         <Button color="primary" type="submit">
//                             Sign in
//                         </Button>
//                     </ModalFooter>
//                     <div className="px-4 pb-4 flex flex-col gap-2">
//                         <Button
//                             color="primary"
//                             variant="bordered"
//                             onPress={loginWithGoogle}
//                         >
//                             <FcGoogle />
//                             Sign In With Google
//                         </Button>
//                         <Button
//                             color="primary"
//                             variant="bordered"
//                             onPress={loginWithGitHub}
//                         >
//                             <AiOutlineGithub />
//                             Sign In With Github
//                         </Button>
//                     </div>
//                 </>
//             )}
//         </ModalContent>
//     </Modal>
// </form>
