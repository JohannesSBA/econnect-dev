"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NextUIProvider,
} from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import Main from "../components/Main";
import Progress from "../components/Progress";
import Nav from "../components/Nav";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";

export default function Home() {
  const [lang, setLang] = useState<string>("en");

  return (
    <div className="w-full h-screen dark:bg-blue-900 bg-indigo-400 overflow-clip about-bg">
      <NextUIProvider>
        <ThemeProvider attribute="class">
          {/* Language Changer */}
          <div className="fixed top-5 right-32 z-50">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="light" className="">
                  lang: {lang}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Single selection example"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
              >
                <DropdownItem
                  key="en"
                  onClick={() => setLang("en")}
                  color="primary"
                >
                  English
                </DropdownItem>
                <DropdownItem
                  key="am"
                  onClick={() => setLang("am")}
                  color="primary"
                >
                  Amharic
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <Nav lang={lang} />
          <div className="w-screen flex flex-col justify-between items-center text-black">
            <div className="mt-14 w-4/6 flex flex-col items-center text-center">
              <h1 className=" text-3xl font-bold uppercase">Vision</h1>
              <p>
                To create a seamless platform connecting job seekers in Ethiopia
                with employment opportunities offered by local businesses.
              </p>
            </div>
            <div className="mt-14 w-4/6 flex flex-col items-center">
              <h1 className=" text-3xl font-bold uppercase">Mission</h1>
              <p className="text-center">
                To empower individuals by providing a user-friendly online
                portal for accessing job listings, enabling businesses to find
                qualified candidates, fostering career growth, and reducing
                unemployment in Ethiopia.
              </p>
            </div>
            <div className="mt-14 w-4/6 flex flex-col items-center">
              <h1 className=" text-3xl font-bold uppercase">Who we Are?</h1>
              <p className="text-center">
                LinkedIn began in founders Johannes Bekele and Mehretab
                Molla&apos;`s living room in 2023 and was officially launched on
                October 21, 2024. Today, Econnect leads a diversified business
                with revenues from membership subscriptions, advertising sales
                and recruitment solutions under the leadership of the fonuders.
              </p>
            </div>
            <div className="fixed bottom-0 w-full text-white">
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </NextUIProvider>
    </div>
  );
}
