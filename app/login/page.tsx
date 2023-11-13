"use client";
import React, { FormEvent, useState } from "react";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import { AiOutlineMail, AiFillLock, AiOutlineGithub } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
    <>
      <Button color="primary">Login</Button>
      Log in
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
        <div className="flex justify-end">
          <Button color="danger" variant="flat">
            Close
          </Button>
          <Button color="primary" type="submit">
            Sign in
          </Button>
        </div>
      </form>
    </>
  );
}
