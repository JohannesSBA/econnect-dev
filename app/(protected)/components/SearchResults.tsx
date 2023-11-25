import axios from "axios";
import React from "react";

interface searchProps {
  encodedSearchQuery: string;
  searchQuery: string;
}

const SearchResults = async ({
  encodedSearchQuery,
  searchQuery,
}: searchProps) => {
  const fetchUsers = async (url: string) => {
    const response = await axios.get(`/api/search?q=${encodedSearchQuery}`);
    if (!response) {
      throw new Error("failed to fetch posts");
    }
    console.log("this the data", response.data);
    return response;
  };

  const allUsers = await fetchUsers(searchQuery as string);

  return <div>{allUsers.data.map()}</div>;
};

export default SearchResults;
