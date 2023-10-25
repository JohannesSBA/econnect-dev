"use client";

import React, { FormEvent } from "react";
export default function Form() {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const response = await fetch(`../lib/register`, {
            method: "POST",
            body: JSON.stringify({
                email: formData.get("email"),
                password: formData.get("password"),
            }),
        });
        console.log(response);
    };
    return (
        <div className="flex">
            <form
                onSubmit={handleSubmit}
                className="text-black flex flex-col justify-between align-middle h-screen w-full"
            >
                <input type="email" placeholder="email" className="w-72 flex" />
                <input
                    type="password"
                    placeholder="password"
                    className="w-72"
                />
                <button type="submit" className="text-white">
                    Register
                </button>
            </form>
        </div>
    );
}
