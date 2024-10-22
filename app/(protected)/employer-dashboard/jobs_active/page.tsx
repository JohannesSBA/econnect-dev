"use client";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Jobs } from "@/app/types/db";
import axios from "axios";
import { Session, getServerSession } from "next-auth";
import React, { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { toast } from "sonner";
import NewJobListing from "../../components/NewJobListing";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  User,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    const getJobs = async () => {
      try {
        const res = await axios.post("/api/job/get/business");
        const nonExpiredJobs = res.data.filter((job: Jobs) => !job.Expired);
        setJobs(nonExpiredJobs);
      } catch {
        return toast.error("Sorry, something went wrong.");
      }
    };
    getJobs();
  }, []);

  const deleteJob = async (id: string) => {
    try {
      const res = await axios.post("/api/job/delete", { id });
    } catch {
      return toast.error("Sorry, something went wrong.");
    } finally {
      onOpenChange();
      router.refresh();
    }
  };

  return (
    <div className="flex w-screen h-[calc(100vh-5rem)] bg-slate-100">
      <div className="h-full w-full p-6">
        <h1 className="text-black font-bold text-2xl">Active Job Listings</h1>
        <div className="flex flex-col gap-4 mt-4 p-4">
          {jobs?.length === 0 ? (
            <div className="text-black">No Active Job Listings</div>
          ) : (
            jobs?.map((job) => (
              <div
                key={job.id}
                className="w-[28rem] md:w-full h-40 p-2 flex items-center bg-white overflow-clip"
              >
                <div className="flex w-full h-full">
                  <Link
                    className="flex gap-2 h-full w-full"
                    href={`/employer-dashboard/listing/${job.id}`}
                  >
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
                        {job.applicants?.length > 100
                          ? "Over 100 applicants"
                          : job.applicants.length == 0
                          ? "No applicants"
                          : job.applicants.length == 1
                          ? "1 applicant"
                          : `${job.applicants.length} applicants`}
                      </span>
                    </div>
                  </Link>

                  <Modal
                    backdrop="opaque"
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    classNames={{
                      backdrop:
                        "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                    }}
                  >
                    <ModalContent>
                      {(onClose) => (
                        <>
                          <ModalHeader className="flex flex-col gap-1 text-black">
                            Delete Job Listing
                          </ModalHeader>
                          <ModalBody>
                            <p className="text-black text-center">
                              By Deleting the job listing, it will no longer be
                              available to applicants. You can always create a
                              new job listing, or retrieve this listing from the
                              archived Page
                            </p>
                          </ModalBody>
                          <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                              Cancel
                            </Button>
                            <Button
                              color="danger"
                              onClick={() => deleteJob(job.id)}
                            >
                              Delete
                            </Button>
                          </ModalFooter>
                        </>
                      )}
                    </ModalContent>
                  </Modal>
                </div>
                <div className="flex flex-col">
                  <Button
                    color="primary"
                    className=" mr-16 z-50 border-2"
                    as={Link}
                    href={`/employer-dashboard/applicants/${job.id}`}
                  >
                    See Applicants
                  </Button>
                  <Button
                    color="danger"
                    className=" mr-16 z-50 border-2"
                    onPress={onOpen}
                  >
                    Delete Listing
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
