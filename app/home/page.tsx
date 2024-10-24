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

export default function Home() {
  const [lang, setLang] = useState<string>("en");

  return (
    <div className="w-full bg-blue-900">
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
          <Progress />
          <Nav lang={lang} />
          <Main lang={lang} />
        </ThemeProvider>
      </NextUIProvider>
    </div>
  );
}
