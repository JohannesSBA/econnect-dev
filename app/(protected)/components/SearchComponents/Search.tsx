"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Search = () => {
  const [searchQuery, setSearchQeury] = useState<string>("");
  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const encodedSearchQuery = encodeURI(searchQuery);

    router.push(`/search?q=${encodedSearchQuery}`);
  };

  return (
    <div className="flex flex-col gap-2 ">
      <form onSubmit={onSearch}>
        <input
          value={searchQuery}
          onChange={(event) => setSearchQeury(event.target.value)}
          placeholder="Search"
          className="px-5 py-1 sm:px-5 sm:py-3 flex-1 text-zinc-800 bg-zinc-200 rounded-xl"
        />
      </form>
      {/* {searchQuery && <ul> {searchQuery}</ul>} */}
    </div>
  );
};

export default Search;
