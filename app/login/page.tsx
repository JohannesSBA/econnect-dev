"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { Button, Checkbox, Input, Link, Spinner } from "@nextui-org/react";
import { AiOutlineMail, AiFillLock, AiOutlineGithub } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export default function Login() {
    const [password, setPassword] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [visible, setVisible] = useState<boolean>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const router = useRouter();
    const location = useSearchParams();

    useEffect(() => {
        if (location.get("verified")) {
            toast.success("Email Successfully Verified");
        }
    }, [location]);

    loading ? toast.loading("Loading...") : toast.dismiss();

    async function loginWithCredentials(e: FormEvent<HTMLFormElement>) {
        setLoading(true);
        e.preventDefault();

        let res = await signIn("credentials", {
            email,
            password,
            callbackUrl: "https://localhost:3000/dashboard",
            redirect: false,
        });
        setLoading(false);
        if (!res?.ok) {
            toast.error(res?.error);
            setError(res?.error as string);
            console.log(res?.error);
        }
        if (res?.ok) {
            router.push("/dashboard");
        }
    }

    return (
        <div className="w-screen h-screen flex">
            <div className="md:w-1/3 lg:w-2/3 h-screen cs-background hidden md:flex items-center">
                <div className="p-24  rounded-2xl text-center m-12 h-5/6 w-full flex justify-center align-middle"></div>
            </div>
            <div className="w-screen md:w-2/3 lg:w-1/3 flex flex-col justify-center align-middle p-12 bg-slate-100 text-slate-800">
                <h1 className="py-6 px-2 font-bold text-4xl">Login</h1>
                <form
                    className="flex flex-col gap-3"
                    onSubmit={loginWithCredentials}
                >
                    <Input
                        endContent={<AiOutlineMail />}
                        required
                        label="Email"
                        className="text-slate-800"
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
                            {loading ? <Spinner color="default" /> : "Sign in"}
                        </Button>
                    </div>
                    <h1>{error}</h1>
                </form>
            </div>
        </div>
    );
}
