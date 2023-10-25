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
        <div className="flex ">
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="email" />
                <input type="password" placeholder="password" />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
