"use client";
import React, { FormEvent, useState } from "react";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import { AiOutlineMail, AiFillLock, AiOutlineGithub } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Image } from "@nextui-org/react";
import { GiWaterDrop } from "react-icons/gi";
import { IconContext } from "react-icons";

export default function Login() {
  const [password, setPassword] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [visible, setVisible] = useState<boolean>();

  const router = useRouter();

  async function loginWithCredentials(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
    <div className="w-screen h-screen flex">
      <div className="w-2/3  h-screen cs-background flex items-center">
        <div className="p-24  rounded-2xl text-center m-12 h-5/6 w-full flex justify-center align-middle">
          <IconContext.Provider
            value={{
              className: "global-class-name hidden md:flex",
              size: "38em",
              color: "white",
            }}
          >
            <GiWaterDrop />
          </IconContext.Provider>
        </div>
      </div>
      <div className="w-1/3 flex flex-col justify-center align-middle p-12">
        <h1 className="py-6 px-2 font-bold text-4xl">Login</h1>
        <form className="flex flex-col gap-3" onSubmit={loginWithCredentials}>
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
          <div className="flex justify-end ">
            <Button
              color="primary"
              type="submit"
              size="lg"
              className="w-full hover:bg-blue-700 rounded-full"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
