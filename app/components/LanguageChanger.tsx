import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

export default function App() {
  const [selectedKeys, setSelectedKeys] = useState("en");

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="capitalize">
          {selectedKeys}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
      >
        <DropdownItem key="en">English</DropdownItem>
        <DropdownItem key="am">Amharic</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
