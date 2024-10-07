"use client";

import axios from "axios";
import React, { FormEvent, useReducer, useState } from "react";
import validateCredentials from "../helpers/validateForm";
import { Button, Checkbox, Input, Radio, RadioGroup } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import Nav from "../components/Nav";

export default function Form() {
  const [email, setEmail] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [role, setRole] = useState<string>();
  const [visible, setVisible] = useState<boolean>();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const router = useRouter();

  function passWordMatch(password: string, confirmedPassword: string) {
    if (password === confirmedPassword) {
      return true;
    } else {
      return false;
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passWordMatch(password as string, confirmPassword as string)) {
      toast.error("Password Do not Match");
      return;
    } else {
      const validated = validateCredentials(
        email as string,
        password as string
      );

      if (validated === true) {
        try {
          let resq = await axios.post("/api/user/register", {
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: password,
            phoneNumber: phoneNumber,
            role: role,
          });
          if (resq.status === 200) {
            toast.success("An Email was sent to you for verification");
            setIsDisabled(true);
          }
        } catch (error: any) {
          // 'any' type is used here, but try to use a more specific type if possible
          toast.error(`Error: ${error.response?.data}`);
        }
      }
    }
  };

  return (
    <div className="w-screen h-screen flex">
      <div className="md:w-1/3 lg:w-2/3 h-screen cs-background hidden md:flex items-center">
        <div className="absolute top-0 w-screen">
          <Nav lang={"en"} />
        </div>
        <div className="p-24 rounded-2xl text-center m-12 h-5/6 w-full flex justify-center align-middle"></div>
      </div>
      <div className="sm:w-full md:w-2/3 flex flex-col mt-12 justify-center p-12">
        <h1 className="py-6 px-2 font-bold text-4xl">Sign Up</h1>
        <form
          onSubmit={handleSubmit}
          className="text-white flex flex-col gap-8 align-middle h-screen w-full"
        >
          <div className="flex py-2 px-1 justify-center w-full text-white">
            <Button
              className="w-full"
              radius="none"
              onClick={() => {
                setRole("EMPLOYEE");
              }}
              {...(role === "EMPLOYEE" && { color: "primary" })}
            >
              Employee
            </Button>
            <Button
              className="w-full"
              radius="none"
              {...(role === "EMPLOYER" && { color: "primary" })}
              onClick={() => {
                setRole("EMPLOYER");
              }}
            >
              Employer
            </Button>
          </div>
          {role === "EMPLOYEE" ? (
            <div className="flex gap-4">
              <Input
                required
                label="First Name"
                placeholder="Enter your first name"
                variant="bordered"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
              <Input
                required
                label="Last Name"
                placeholder="Enter your last name"
                variant="bordered"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>
          ) : (
            <Input
              required
              label="Business Name"
              placeholder="Enter your Business's name"
              variant="bordered"
              onChange={(e) => {
                setFirstName(e.target.value);
                setLastName("");
              }}
            />
          )}

          <Input
            required
            label="Email"
            placeholder="Enter your email"
            variant="bordered"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            required
            label="Phone Number"
            placeholder="Enter your Phone Number"
            type="phoneNumber"
            variant="bordered"
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
          />
          <div className="flex gap-4">
            <Input
              required
              label="Password"
              placeholder="Enter your password"
              type={visible ? "text" : "password"}
              variant="bordered"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Input
              required
              label="Confirm Password"
              placeholder="Confirm your password"
              type={visible ? "text" : "password"}
              variant="bordered"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>
          <Checkbox
            classNames={{
              label: "text-small",
            }}
            onClick={() => setVisible(!visible)}
          >
            <p className="text-slate-200">Show Password</p>
          </Checkbox>

          <Button
            color="primary"
            type="submit"
            size="lg"
            className="w-full hover:bg-blue-700 rounded-full"
            disabled={isDisabled}
          >
            {isDisabled ? "Email Sent" : "Sign Up"}
          </Button>
        </form>
      </div>
    </div>
  );
}
