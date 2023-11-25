"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import SearchResults from "../../components/SearchResults";

const SearchPage = () => {
  const search = useSearchParams();
  const searchQuery = search ? search.get("q") : null;
  const encodedSearchQuery = encodeURI(searchQuery || "");

  const fetchUsers = async (url: string) => {
    const response = await axios.get(`/api/search?q=${encodedSearchQuery}`);
    if (!response) {
      throw new Error("failed to fetch posts");
    }
    console.log("this the data", response.data);
    return response;
  };

  const allUsers = fetchUsers(searchQuery as string);

  const p = async (allUsers: any) => {
    return await allUsers;
  };

  return (
    <div className="w-screen h-screen flex justify-center align-middle">{}</div>
  );
};

export default SearchPage;
