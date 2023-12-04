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
    <div className="w-screen h-screen flex justify-center align-middle">
      {users.map(
        (user: {
          id: React.Key | string | null | undefined;
          firstName: any;
          lastName: any;
          bio: string;
          image: string;
          title: string;
        }) => (
          <div key={user.id}>
            <User
              name={user.firstName + " " + user.lastName}
              description={user.title}
              isFocusable
              avatarProps={{
                src: user.image,
              }}
            />
            <AddFriendButton id={user.id as string} />
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;
