"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchResults from "../../components/SearchResults";

const fetchUsers = async (encodedSearchQuery: string) => {
  const response = await axios.get(`/api/search?q=${encodedSearchQuery}`);
  if (!response) {
    throw new Error("Failed to fetch users");
  }
  return response.data;
};

const SearchPage = () => {
  const search = useSearchParams();
  const searchQuery = search ? search.get("q") : null;
  const encodedSearchQuery = encodeURI(searchQuery || "");

  const [users, setUsers] = useState([] as any[]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await fetchUsers(encodedSearchQuery);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, [encodedSearchQuery]);

  return (
    <div className="w-screen h-screen flex justify-center align-middle">
      {users.map(
        (user: {
          id: React.Key | null | undefined;
          name: any;
          bio: string;
          image: string;
        }) => (
          <div key={user.id}>
            <SearchResults name={user.name} pic={user.image} />
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;
