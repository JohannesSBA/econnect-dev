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
} from "@nextui-org/react";
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
    <div className="w-screen h-screen bg-white flex ">
      <div className="absolute flex right-0 w-screen md:w-[calc(100vw-25rem)] h-[calc(100vh-5rem)] items-end overflow-scroll">
        <div className="w-2/3 h-full overflow-scroll flex flex-col p-8 border-l">
          <div className="w-full flex flex-col gap-2 py-2 my-4">
            <h1 className="text-5xl text-black font-semibold uppercase">
              {listing?.title as string}
            </h1>
            <div className="flex gap-8 text-slate-500">
              <h1 className="flex gap-2 items-center">
                {" "}
                <FaLocationDot />
                {listing?.location as string}
              </h1>
              <h1 className="flex gap-2 items-center">
                {" "}
                <FaBriefcase />
                {listing?.jobType as string}
              </h1>
            </div>
          </div>
          <h1 className="text-black">
            <span className="font-semibold">Description:</span>{" "}
            <h2 className="">{listing?.description as string}</h2>
          </h1>
        </div>
        <div className="w-1/3 h-full overflow-scroll flex flex-col justify-start items-center p-16">
          <Image
            src={`https://econnectbucket.s3.amazonaws.com/${listing?.postedById}`}
            alt="Picture of the author"
          ></Image>
          <h1 className="font-bold text-xl text-black">
            {postedBy?.firstName}
          </h1>
          <p className="text-slate-700 text-sm">{postedBy?.title}</p>
          <p className="text-slate-700 text-xs mt-5 text-center">
            {postedBy?.bio}
          </p>

          <Button onPress={onOpen} className="mt-6">
            Apply
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
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
    </div>
  );
};

export default Page;
