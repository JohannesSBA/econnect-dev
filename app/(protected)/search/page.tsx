"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import parse from "html-react-parser";
import { User } from "@nextui-org/react";

const SearchPage = () => {
  const search = useSearchParams();
  const searchQuery = search ? search.get("q") : null;
  const encodedSearchQuery = encodeURI(searchQuery || "");

  const [users, setUsers] = useState([] as any[]);
  const [posts, setPosts] = useState([] as any[]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await axios.get(
          `/api/user/post/search?q=${encodedSearchQuery}`
        );
        setPosts(fetchedUsers.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, [encodedSearchQuery]);

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-white">
      <div className="flex flex-col items-center h-full w-1/2 overflow-scroll scrollbar-webkit scrollbar-thin">
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
                    src: `https://econnectbucket.s3.amazonaws.com/image/${user.id}`,
                    alt: `/user-avatar`,
                  }}
                />
              </a>
            </div>
          )
        )}
      </div>
      <div className="flex flex-col items-center h-full w-1/2 overflow-scroll scrollbar-webkit scrollbar-thin">
        {posts.map(
          (post: {
            id: React.Key | null | undefined;
            content: any;
            title: any;
            createdAt: Date;
            author: any;
          }) => (
            <div
              key={post.id}
              className="shadow-md my-2 mx-1 rounded-md bg-white p-2 "
            >
              <div className="flex justify-between">
                <h1 className="font-bold">{post.author?.firstName}</h1>
                <h1 className="font-bold">{post.title}</h1>
                <h1 className="text-sm font-light text-slate-600">
                  {new Date(post.createdAt).toLocaleDateString("en-us", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </h1>
              </div>
              <h1 className="pl-2 text-sm text-slate-500">
                {parse(post.content)}
              </h1>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchPage;
