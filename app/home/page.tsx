"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import Main from "../components/Main";
import Progress from "../components/Progress";
import Nav from "../components/Nav";

// const Navbar = dynamic(() => import("../components/Navbar"), { ssr: false });

export default function home() {
  return (
    <div className="w-full dark:bg-blue-900 bg-indigo-400">
      <NextUIProvider>
        <ThemeProvider attribute="class">
          <Progress />
          <Nav />
          <Main />
        </ThemeProvider>
      </NextUIProvider>
    </div>
  );
}
