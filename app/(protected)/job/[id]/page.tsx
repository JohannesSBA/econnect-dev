"use client";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getListing } from "@/app/helpers/getListing";
import { getUserContent } from "@/app/helpers/getUser";
import prisma from "@/app/lib/prisma";
import { Jobs } from "@/app/types/db";
import { Button, Card, Image, Link } from "@nextui-org/react";
import axios from "axios";
import { getServerSession } from "next-auth";
import { notFound, redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaBriefcase } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { toast } from "sonner";

const Page = ({ params }: { params: { id: string } }) => {
  const [listing, setListing] = useState<any>();
  const [postedBy, setPostedBy] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const listingData = await axios.post("/api/job/listing", {
        id: params.id,
      });
      setListing(listingData.data);

      const postedByData = await getUserContent(
        listingData?.data.postedById as string
      );
      setPostedBy(postedByData);
    };

    fetchData();
  }, [params.id]);

  //   useEffect(() => {
  //     const fetchUser = async () => {
  //       const postedByData = await getUserContent(listing.postedById);
  //       setPostedBy(postedByData);
  //     };
  //     fetchUser();
  //   }, [listing]);

  const handleSubmit = async () => {
    console.log("clicked");
  };

  return (
    <div className="w-screen h-screen bg-white flex ">
      <div className="absolute flex right-0 w-[calc(100vw-25rem)] h-[calc(100vh-5rem)] items-end overflow-scroll">
        <div className="w-2/3 h-full overflow-scroll flex flex-col p-8 border-l">
          <Link href="/employer-dashboard">
            <Button
              variant="light"
              className="bg-slate-200 flex gap-2 font-semibold"
            >
              <FaArrowLeft />
              All Jobs
            </Button>
          </Link>
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
            <h2 className="">{listing?.descriptio as string}</h2>
          </h1>
        </div>
        {/* <div className="w-1/3 h-full overflow-scroll flex flex-col justify-start items-center p-16">
          <Image
            src={`https://econnectbucket.s3.amazonaws.com/${listing?.postedById}`}
            alt="Picture of the author"
          ></Image>
          <h1 className="font-bold text-xl text-black">{postedBy.firstName}</h1>
          <p className="text-slate-700 text-sm">{postedBy.title}</p>
          <p className="text-slate-700 text-xs mt-5 text-center">
            {postedBy.bio}
          </p>
          <Button onClick={handleSubmit}>Apply Now</Button>
        </div> */}
      </div>
    </div>
  );
};

export default Page;
