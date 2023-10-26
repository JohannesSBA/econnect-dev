"use client";

import axios from "axios";
import React, { FormEvent, useState } from "react";
export default function Form() {

    const [email,setEmail] = useState<string>();
    const [password,setPassword] = useState<string>();
    const [phoneNumber,setPhoneNumber] = useState<string>();


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        console.log(email)
        console.log(password)
        console.log(phoneNumber)
        e.preventDefault();

        await axios.post("/api/user/register", {
            email: email,
            password: password,
            phoneNumber: phoneNumber
        });

    };
    return (
        <div className="flex">
            <form
                onSubmit={handleSubmit}
                className="text-black flex flex-col justify-between align-middle h-screen w-full"
            >
                <input type="email" placeholder="email" className="w-72 flex" onChange={(e) => {setEmail(e.target.value)}} />
                <input type="string" placeholder="Phone Number" className="w-72 flex" onChange={(e) => {setPhoneNumber(e.target.value)}} />
                <input
                    type="password"
                    placeholder="password"
                    className="w-72"
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                <input
                    type="password"
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
