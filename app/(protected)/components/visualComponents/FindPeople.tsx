"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardBody,
    CardFooter,
    Avatar,
    Button,
    Chip,
    Skeleton,
} from "@nextui-org/react";
import { FaUser, FaPlus } from "react-icons/fa";
import AddFriendButton from "../functionComponents/AddFriendButton";

interface Person {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    role: string;
    email: string;
    telephone: string;
    imageUrl: string;
}

export default function FindPeople() {
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post("/api/findFriends", {
                    from: "my",
                });
                setPeople(res.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-2 p-3">
            <p>Suggested Connections</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                {loading
                    ? Array.from({ length: 4 }).map((_, index) => (
                          <Card key={index} className="max-w-sm">
                              <CardBody className="overflow-visible py-2 flex flex-col items-center gap-4">
                                  <Skeleton className="w-24 h-24" />
                                  <div className="flex flex-col items-center gap-2">
                                      <Skeleton className="w-32 h-6" />
                                      <Skeleton className="w-24 h-4" />
                                      <Skeleton className="w-20 h-6" />
                                  </div>
                              </CardBody>
                              <CardFooter className="pt-2 flex gap-2 justify-center">
                                  <Skeleton className="w-20 h-8" />
                                  <Skeleton className="w-20 h-8" />
                              </CardFooter>
                          </Card>
                      ))
                    : people.map((person) => (
                          <Card key={person.id} className="max-w-sm">
                              <CardBody className="overflow-visible py-2 flex flex-col items-center gap-4">
                                  <Avatar
                                      isBordered
                                      radius="lg"
                                      size="lg"
                                      src={`https://econnectbucket.s3.amazonaws.com/image/${person.id}`}
                                      className="w-24 h-24 text-large"
                                  />
                                  <div className="flex flex-col items-center gap-2">
                                      <h4 className="text-md text-center font-semibold text-default-700">
                                          {person.firstName} {person.lastName}
                                      </h4>
                                      <p className="text-xs text-default-500">
                                          {person.email}
                                      </p>
                                      <Chip
                                          className="bg-success/10 text-success"
                                          size="sm"
                                          variant="flat"
                                      >
                                          {person.title}
                                      </Chip>
                                  </div>
                              </CardBody>
                              <CardFooter className="pt-2 flex gap-2 justify-center flex-col">
                                  <Button
                                      className="flex-1 p-2"
                                      color="primary"
                                      variant="light"
                                      startContent={<FaUser size={18} />}
                                      as="a"
                                      href={`mailto:${person.email}`}
                                  >
                                      Email
                                  </Button>
                                  <AddFriendButton id={person.id} />
                                  <Button
                                      color="primary"
                                      variant="ghost"
                                      as="a"
                                      href={`ec/${person.id}`}
                                  >
                                      Profile
                                  </Button>
                              </CardFooter>
                          </Card>
                      ))}
            </div>
        </div>
    );
}
