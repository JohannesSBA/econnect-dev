"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import parse from "html-react-parser";
import {
  Button,
  Link,
  Image,
  User,
  divider,
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Tab,
  Tabs,
} from "@nextui-org/react";
import Search from "../components/SearchComponents/Search";
import { Post } from "@prisma/client";
import { FaLocationDot } from "react-icons/fa6";
import { getUserContent } from "@/app/helpers/getUser";
import { User as DbUser } from "@/app/types/db";
import {
  MdDescription,
  MdThumbUp,
  MdComment,
  MdShare,
  MdPerson,
  MdBusinessCenter,
  MdLocationOn,
  MdWork,
  MdAttachMoney,
} from "react-icons/md";

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

  const fetchData = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await axios.get(`/api/search`, {
        params: { q: encodedSearchQuery },
      });
      const {
        users: newUsers = [],
        posts: newPosts = [],
        listings: newListings = [],
      } = response.data;

      setUsers(newUsers);
      setPosts(newPosts);
      setListings(newListings);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [encodedSearchQuery, hasMore, loading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  console.log(users[0]);

  return (
    <div className="w-screen h-screen flex flex-col items-center bg-slate-200">
      {/* <div className="flex flex-col items-center h-full w-full overflow-scroll scrollbar-webkit scrollbar-thin">
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
                        {job.applicant.length > 100
                          ? "Over 100 applicants"
                          : job.applicant.length == 0
                          ? "No applicants"
                          : job.applicant.length == 1
                          ? "1 applicant"
                          : `${job.applicant.length} applicants`}
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
      </div> */}

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Search Results for "{searchQuery}"
        </h2>

        <Tabs
          aria-label="Search result categories"
          color="default"
          variant="underlined"
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-gray-200",
            cursor: "w-full bg-gray-800",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-gray-800",
          }}
        >
          <Tab
            key="posts"
            title={
              <div className="flex items-center gap-2">
                <MdDescription className="text-gray-700" />
                <span>Posts</span>
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-gray-200 text-gray-700"
                >
                  {posts.length}
                </Chip>
              </div>
            }
          >
            <div className="grid gap-6 mt-6">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="bg-white shadow-sm border border-gray-200"
                >
                  <CardHeader className="justify-between">
                    <div className="flex gap-3">
                      <Avatar src={post.avatar} size="md" />
                      <div className="flex flex-col items-start justify-center">
                        <h4 className="text-small font-semibold leading-none text-gray-800">
                          {post.author}
                        </h4>
                        <h5 className="text-small tracking-tight text-gray-500">
                          {post.role}
                        </h5>
                      </div>
                    </div>
                    <Button
                      color="default"
                      variant="flat"
                      size="sm"
                      className="bg-gray-100 text-gray-700"
                    >
                      Follow
                    </Button>
                  </CardHeader>
                  <CardBody className="px-3 py-0 text-small text-gray-600">
                    <p>{post.content}</p>
                  </CardBody>
                  <CardFooter className="gap-3">
                    <div className="flex gap-1">
                      <p className="font-semibold text-gray-700 text-small">
                        {post.likes}
                      </p>
                      <p className="text-gray-500 text-small">Likes</p>
                    </div>
                    <div className="flex gap-1">
                      <p className="font-semibold text-gray-700 text-small">
                        {post.comments}
                      </p>
                      <p className="text-gray-500 text-small">Comments</p>
                    </div>
                  </CardFooter>
                  <Divider className="bg-gray-200" />
                  <CardFooter>
                    <Button
                      variant="light"
                      className="text-gray-700"
                      size="sm"
                      startContent={<MdThumbUp />}
                    >
                      Like
                    </Button>
                    <Button
                      variant="light"
                      className="text-gray-700"
                      size="sm"
                      startContent={<MdComment />}
                    >
                      Comment
                    </Button>
                    <Button
                      variant="light"
                      className="text-gray-700"
                      size="sm"
                      startContent={<MdShare />}
                    >
                      Share
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </Tab>
          <Tab
            key="users"
            title={
              <div className="flex items-center gap-2">
                <MdPerson className="text-gray-700" />
                <span>Users</span>
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-gray-200 text-gray-700"
                >
                  {users.length}
                </Chip>
              </div>
            }
          >
            <div className="grid gap-6 mt-6">
              {users.map((user) => (
                <Card
                  key={user.id}
                  className="bg-white shadow-sm border border-gray-200"
                >
                  <CardBody>
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={`https://econnectbucket.s3.amazonaws.com/image/${user.id}`}
                        className="h-20 w-20"
                      />
                      <div className="flex-grow">
                        <h4 className="text-large font-semibold text-gray-800">
                          {user.firstName + " " + user.lastName}
                        </h4>
                        <p className="text-small text-gray-500">
                          {user.role === "EMPLOYEE" ? "" : "Company"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <MdBusinessCenter className="text-gray-400" />
                          <span className="text-xs text-gray-600">
                            {user.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MdLocationOn className="text-gray-400" />
                          <span className="text-xs text-gray-600">
                            {user.location}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-small font-semibold text-gray-700">
                          {user.connections}
                        </p>
                        <p className="text-tiny text-gray-500">connections</p>
                        {user.role === "EMPLOYEE" ? (
                          <Button
                            color="default"
                            as={Link}
                            href={`/ec/${user.id}`}
                            variant="flat"
                            className="mt-2 bg-gray-100 text-gray-700"
                          >
                            Profile
                          </Button>
                        ) : (
                          <Button
                            color="default"
                            as={Link}
                            href={`/company/${user.id}`}
                            variant="flat"
                            className="mt-2 bg-gray-100 text-gray-700"
                          >
                            Profile
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Tab>
          <Tab
            key="listings"
            title={
              <div className="flex items-center gap-2">
                <MdWork className="text-gray-700" />
                <span>Listings</span>
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-gray-200 text-gray-700"
                >
                  {listings.length}
                </Chip>
              </div>
            }
          >
            <div className="grid gap-6 mt-6">
              {listings.map((listing) => (
                <Card
                  key={listing.id}
                  className="bg-white shadow-sm border border-gray-200"
                >
                  <CardBody>
                    <div className="flex items-start gap-4">
                      <Avatar src={listing.logo} className="h-14 w-14" />
                      <div className="flex-grow">
                        <h4 className="text-large font-semibold text-gray-800">
                          {listing.title}
                        </h4>
                        <p className="text-small text-gray-500">
                          {listing.company}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Chip
                            size="sm"
                            variant="flat"
                            className="bg-gray-100 text-gray-700"
                            startContent={
                              <MdLocationOn className="text-gray-500" />
                            }
                          >
                            {listing.location}
                          </Chip>
                          <Chip
                            size="sm"
                            variant="flat"
                            className="bg-gray-100 text-gray-700"
                            startContent={
                              <MdBusinessCenter className="text-gray-500" />
                            }
                          >
                            {listing.type}
                          </Chip>
                          <Chip
                            size="sm"
                            variant="flat"
                            className="bg-gray-100 text-gray-700"
                            startContent={
                              <MdAttachMoney className="text-gray-500" />
                            }
                          >
                            {listing.salary}
                          </Chip>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-tiny text-gray-500">
                          Posted {listing.posted}
                        </p>
                        <Button
                          color="default"
                          className="mt-2 bg-gray-800 text-white"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Tab>
        </Tabs>
      </div>

      {/* Repeat similar structure for posts and listings */}
    </div>
  );
};

export default SearchPage;
