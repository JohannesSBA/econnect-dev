import { User } from "@nextui-org/react";
import React from "react";

interface searchProps {
  name: string;
  pic: string;
}

const SearchResults = ({ name, pic }: searchProps) => {
  return (
    <User
      name={name}
      description="Product Designer"
      isFocusable
      avatarProps={{
        src: pic,
      }}
    />
  );
};

export default SearchResults;
