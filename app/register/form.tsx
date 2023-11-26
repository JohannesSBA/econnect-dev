"use client";

import axios from "axios";
import React, { FormEvent, useState } from "react";
import validateCredentials from "../helpers/validateForm";
export default function Form() {
  const [email, setEmail] = useState<string>();
  const [name, setName] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState<string>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validated = validateCredentials(email as string, password as string);
    if (validated.success === true) {
      console.log("p");
      await axios.post("/api/user/register", {
        email: email,
        name: name,
        password: password,
        phoneNumber: phoneNumber,
      });
    } else {
      alert(validated.error);
    }
  };
  return (
    <div className="flex">
      <form
        onSubmit={handleSubmit}
        className="text-black flex flex-col justify-between align-middle h-screen w-full"
      >
        <input
          type="text"
          placeholder="First and Last Name"
          className="w-72 flex"
          required
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          type="email"
          placeholder="email"
          className="w-72 flex"
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="string"
          placeholder="Phone Number"
          className="w-72 flex"
          required
          onChange={(e) => {
            setPhoneNumber(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="password"
          required
          className="w-72"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
          type="password"
          required
          placeholder="Confirm password"
          className="w-72"
        />
        <button type="submit" className="text-white">
          Register
        </button>
      </form>
    </div>
  );
}
