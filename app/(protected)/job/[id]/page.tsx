"use client";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getListing } from "@/app/helpers/getListing";
import { getUserContent } from "@/app/helpers/getUser";
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

  useEffect(() => {
    const jobs = async () => {
      try {
        const job = await getListing(params.id);
        setListing(job);
      } catch {
        return toast.error("Sorry, Something went Wrong.");
      }
    };

    jobs();
  }, [params.id]);

  console.log("list", listing);

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
              {listing.title}
            </h1>
            <div className="flex gap-8 text-slate-500">
              <h1 className="flex gap-2 items-center">
                {" "}
                <FaLocationDot />
                {listing.location}
              </h1>
              <h1 className="flex gap-2 items-center">
                {" "}
                <FaBriefcase />
                {listing.jobType}
              </h1>
            </div>
          </div>
          <h1 className="text-black">
            <span className="font-semibold">Description:</span>{" "}
            <h2 className="">{listing?.description}</h2>
          </h1>
        </div>
        <div className="w-1/3 h-full overflow-scroll flex flex-col justify-start items-center p-16">
          <Image
            src={`https://econnectbucket.s3.amazonaws.com/${listing?.postedBy.id}`}
            alt="Picture of the author"
          ></Image>
          <h1 className="font-bold text-xl text-black">
            {listing?.postedBy.firstName}
          </h1>
          <p className="text-slate-700 text-sm">{listing?.postedBy?.title}</p>
          <Button onClick={handleSubmit}>Apply Now</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
