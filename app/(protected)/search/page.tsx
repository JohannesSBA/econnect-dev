"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { User } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

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
          key: React.Key | string | null | undefined;
          id: string;
          firstName: any;
          lastName: any;
          bio: string;
          title: string;
        }) => (
          <div key={user.key} className="flex w-96">
            <a
              className="w-full h-fit p-6 m-4 shadow-md bg-slate-100 rounded-md text-black hover:bg-slate-400 hover:text-slate-50"
              href={`/ec/${user.id}`}
            >
              <User
                name={user.firstName + " " + user.lastName}
                description={user.title}
                isFocusable
                avatarProps={{
                  src: `https://econnectbucket.s3.amazonaws.com/${user.id}`,
                  alt: `/user-avatar`,
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
