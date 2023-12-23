"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { User } from "@nextui-org/react";
import AddFriendButton from "../../components/AddFriendButton";

const SearchPage = () => {
  const search = useSearchParams();
  const searchQuery = search ? search.get("q") : null;
  const encodedSearchQuery = encodeURI(searchQuery || "");

  const [users, setUsers] = useState([] as any[]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await axios.get(
          `/api/search?q=${encodedSearchQuery}`
        );
        setUsers(fetchedUsers.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, [encodedSearchQuery]);

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-white">
      {users.map(
        (user: {
          id: React.Key | string | null | undefined;
          firstName: any;
          lastName: any;
          bio: string;
          image: string;
          title: string;
        }) => (
          <div key={user.id} className="flex w-96">
            <a
              className="w-full h-fit p-6 m-4 shadow-md bg-slate-100 rounded-md text-black hover:bg-slate-400 hover:text-slate-50"
              href={`/dashboard/ec/${user.id}`}
            >
              <User
                name={user.firstName + " " + user.lastName}
                description={user.title}
                isFocusable
                avatarProps={{
                  src: user.image,
                }}
              />
            </a>
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;
