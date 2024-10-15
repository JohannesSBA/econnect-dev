"use client";
import { getUserContent } from "@/app/helpers/getUser";
import {
  Button,
  Card,
  Checkbox,
  Image,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
  ModalHeader,
  Textarea,
  Avatar,
} from "@nextui-org/react";
import parse from "html-react-parser";
import axios from "axios";
import React, { useEffect, useState, Suspense } from "react";
import { FaArrowLeft, FaBriefcase } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import Loading from "./loading";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { toast } from "sonner";

const Page = ({ params }: { params: { id: string } }) => {
  const [listing, setListing] = useState<any>();
  const [letter, setLetter] = useState<string>("");
  const [postedBy, setPostedBy] = useState<any>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [company, setCompany] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const listingData = await axios.post("/api/job/listing", {
        id: params.id,
      });
      setListing(listingData.data);
      const postedBy = await getUserContent(listingData.data.postedById);
      setPostedBy(postedBy);
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (!listing) return;
    const getPoster = async () => {
      const post = await axios.post("/api/user/get", {
        id: listing.postedById,
      });
      setPostedBy(post.data);
      setIsLoading(false);
    };

    getPoster();
  }, [listing]);

  useEffect(() => {
    if (!postedBy) return;
    const getPoster = async () => {
      const company = await axios.post("/api/user/get", {
        id: postedBy.id,
      });
      setCompany(company);
      setIsLoading(false);
    };

    getPoster();
  }, [postedBy]);

  const handleSubmit = async () => {
    const res = await axios.post("/api/job/apply", {
      listingId: params.id,
      letter: letter,
    });
    if (res.status === 200) {
      toast.success("Successfully Applied!");
      onOpenChange();
    } else {
      toast.error("Something went wrong");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-screen h-[calc(100vh-5rem)] p-4 bg-slate-100 flex text-black">
      <div className="w-2/3 h-full bg-slate-200 flex flex-col p-4">
        <h1 className="text-xl text-[#1E40AF] font-bold w-full flex justify-between">
          Join {postedBy.firstName} &lsquo;s Team as
        </h1>
        <h1 className="w-full overflow-ellipsis text-slate-800 text-7xl font-bold">
          {listing?.title}
        </h1>
        <p className="overflow-y-scroll overflow-x-hidden p-2 scrollbar-thin scrollbar-webkit">
          {parse(listing?.description as string)}
        </p>
      </div>
      <div className="w-1/3 h-full  flex flex-col items-center pt-4">
        <h1 className="w-full text-center text-2xl font-light mb-8">
          Learn about the company
        </h1>
        <Avatar
          src={`https://econnectbucket.s3.amazonaws.com/image/${postedBy.id}`}
          className="w-40 h-40 text-large"
        />
        <h1 className="font-bold text-lg">{postedBy.fullName}</h1>
        <h1>{postedBy.location}</h1>
        <p className="w-[30rem] h-[20rem] overflow-clip text-center mt-2">
          {postedBy.bio}
        </p>
        <Link href={`/ec/${postedBy.id}`}>
          <Button variant="flat">Comapny Page</Button>
        </Link>
        <Button onPress={onOpen} className="mt-6">
          Apply
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent className="light">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-black">
                  Apply Now
                </ModalHeader>
                <ModalBody className="text-slate-900">
                  <label htmlFor="Textarea">
                    Please give a reason as to why you want to work at{" "}
                    {postedBy?.firstName}
                  </label>
                  <Textarea
                    label="Cover Letter"
                    value={letter}
                    onValueChange={setLetter}
                  ></Textarea>
                  <p className="text-xs text-slate-400">
                    Word Count: {letter?.split(" ")?.length - 1} / 300
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={handleSubmit}>
                    Submit
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default Page;
