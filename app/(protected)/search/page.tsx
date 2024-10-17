"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import parse from "html-react-parser";
import { Button, Link, Image, User, divider } from "@nextui-org/react";
import Search from "../components/SearchComponents/Search";
import { Post } from "@prisma/client";
import { FaLocationDot } from "react-icons/fa6";
import { getUserContent } from "@/app/helpers/getUser";
import { User as DbUser } from "@/app/types/db";

const SearchPage = () => {
  const search = useSearchParams();
  const searchQuery = search ? search.get("q") : null;
  const encodedSearchQuery = encodeURI(searchQuery || "");

  const [users, setUsers] = useState([] as any[]);
  const [posts, setPosts] = useState([] as any[]);
  const [listings, setListings] = useState([] as any[]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await axios.get(`/api/user/post/search`, {
        params: { q: encodedSearchQuery },
      });
      const {
        users: newUsers = [],
        posts: newPosts = [],
        listings: newListings = [],
      } = response.data;

      // Ensure that newUsers, newPosts, and newListings are arrays
      setUsers(response.data.users);
      setPosts(response.data.posts);
      setListings(response.data.listings);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [encodedSearchQuery]);

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-slate-200">
      <div className="flex flex-col items-center h-full w-full overflow-scroll scrollbar-webkit scrollbar-thin">
        <div className="flex md:hidden pt-4 rounded-md">
          <Search />
        </div>
        <div className="flex w-full h-full p-4 gap-2 shadow-sm">
          <div className="w-1/3 bg-slate-100 h-full shadow-md p-2">
            <h1 className="text-bold text-2xl text-black">Posts</h1>
            {posts.length > 0 ? (
              posts.map(
                (post: {
                  images: any;
                  id: React.Key | null | undefined;
                  content: any;
                  title: any;
                  createdAt: Date;
                  author: DbUser;
                  authorId: string;
                }) => (
                  <div
                    key={post.id}
                    className="shadow-md my-2 mx-1 rounded-md bg-white text-black p-2 max-w-full overflow-x-clip text-wrap whitespace-normal"
                  >
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <Image
                          src={`https://econnectbucket.s3.amazonaws.com/image/${post?.authorId}`}
                          alt=""
                          className="rounded-full border"
                          width={50}
                        />
                        <div className="flex flex-col m-0 p-0">
                          <h1 className="font-bold">{`${post.author.firstName} ${post.author.lastName}`}</h1>
                          <h1 className="text-slate-600 pl-2 text-[0.65rem] font-light">
                            {post?.author.email}
                          </h1>
                          <h1 className="text-slate-600 pl-2 text-[0.65rem] font-light">
                            {post?.author.title}
                          </h1>
                        </div>
                      </div>
                      <h1 className="text-sm font-light text-slate-600">
                        {new Date(post.createdAt).toLocaleDateString("en-us", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </h1>
                    </div>
                    <h1 className="font-bold">{post.title}</h1>
                    <div>{parse(post.content)}</div>
                    <div className="flex gap-4 m-3">
                      <Image
                        width={200}
                        alt="Application Image"
                        src={`https://econnectbucket.s3.amazonaws.com/newPostImage/${post.authorId}/${post.images}/0`}
                      />
                      <Image
                        width={200}
                        alt="Application Image"
                        src={`https://econnectbucket.s3.amazonaws.com/newPostImage/${post.authorId}/${post.images}/1`}
                      />
                      <Image
                        width={200}
                        alt="Application Image"
                        src={`https://econnectbucket.s3.amazonaws.com/newPostImage/${post.authorId}/${post.images}/2`}
                      />
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <Button
                          color="success"
                          variant="light"
                          className="rounded-md"
                        >
                          Like
                        </Button>
                        <Button
                          color="warning"
                          variant="light"
                          className="rounded-md"
                        >
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="ml-2 text-xl text-semibold text-slate-500">
                There are no posts to display.
              </div>
            )}
          </div>
          <div className="w-1/3 bg-slate-100 h-full shadow-md p-2">
            <h1 className="text-bold text-2xl text-black">Users</h1>
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="flex w-96">
                  <a
                    className="w-full h-fit p-6 m-4 shadow-md bg-slate-100 rounded-md text-black hover:bg-slate-400 hover:text-slate-50"
                    href={`/ec/${user.id}`}
                  >
                    <User
                      name={`${user.firstName} ${user.lastName}`}
                      description={user.title}
                      avatarProps={{
                        src: `https://econnectbucket.s3.amazonaws.com/image/${user.id}`,
                        alt: `/user-avatar`,
                      }}
                    />
                  </a>
                </div>
              ))
            ) : (
              <div className="ml-2 text-xl text-semibold text-slate-500">
                There are no Users to display.
              </div>
            )}
            {loading && <p>Loading more results...</p>}
          </div>
          <div className="w-1/3 bg-slate-100 h-full shadow-md p-2">
            <h1 className="text-bold text-2xl text-black">Listings</h1>
            {listings.length > 0 ? (
              listings.map((job) => (
                <Link
                  key={job.id}
                  href={`/job/${job.id}`}
                  className="w-[28rem] h-40 p-2 flex items-center bg-white overflow-clip"
                >
                  <div className="flex">
                    <div className="flex items-center">
                      <User
                        avatarProps={{
                          src: `https://econnectbucket.s3.amazonaws.com/image/${job.postedById}`,
                        }}
                        className="transition-transform"
                        description={""}
                        name={""}
                      />
                    </div>
                    <div>
                      <span className="text-blue-800 text-sm">{job.title}</span>
                      <h3 className="font-bold mt-px text-black">
                        {job.shortDescription}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm">
                          {job.jobType}
                        </span>
                        <span className="text-slate-600 text-sm flex gap-1 items-center">
                          {" "}
                          <FaLocationDot /> {job.location}
                        </span>
                        <span className="text-slate-600 text-sm">
                          {job.createdAt}
                        </span>
                      </div>
                      <span className="text-slate-400 text-xs">
                        {job.applicants.length > 100
                          ? "Over 100 applicants"
                          : job.applicants.length == 0
                          ? "No applicants"
                          : job.applicants.length == 1
                          ? "1 applicant"
                          : `${job.applicants.length} applicants`}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="ml-2 text-xl text-semibold text-slate-500">
                There are no Listings to display.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Repeat similar structure for posts and listings */}
    </div>
  );
};

export default SearchPage;
