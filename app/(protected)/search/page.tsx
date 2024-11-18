"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Button,
  Link,
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
        params: { q: encodedSearchQuery, page, pageSize: 20 }, // Pass pagination parameters
      });

      const {
        users: newUsers = [],
        posts: newPosts = [],
        listings: newListings = [],
        currentPage,
        pageSize,
      } = response.data;

      // Update results
      setUsers((prev) => [...prev, ...newUsers]);
      setPosts((prev) => [...prev, ...newPosts]);
      setListings((prev) => [...prev, ...newListings]);

      // Check if there are more results
      const noMoreUsers = newUsers.length < pageSize;
      const noMorePosts = newPosts.length < pageSize;
      const noMoreListings = newListings.length < pageSize;

      if (noMoreUsers && noMorePosts && noMoreListings) {
        setHasMore(false);
      }

      // Increment page only if there are more results
      setPage(currentPage + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [encodedSearchQuery, hasMore, loading, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  console.log(users[0]);

  return (
    <div className="w-screen h-screen flex overflow-scroll pb-12 flex-col items-center bg-gradient-to-br from-white to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Search Results for &quot;{searchQuery}&quot;
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
