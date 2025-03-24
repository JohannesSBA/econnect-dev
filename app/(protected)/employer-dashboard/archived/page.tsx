"use client";
import  parse  from "html-react-parser";
import { Jobs } from "@/app/types/db";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { toast } from "sonner";
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
  const [jobs, setJobs] = useState<any[]>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    const getJobs = async () => {
      try {
        const res = await axios.post("/api/job/get/business");
        const nonExpiredJobs = res.data.filter((job: Jobs) => job.Expired);
        setJobs(nonExpiredJobs);
      } catch {
        return toast.error("Sorry, something went wrong.");
      }
    };
    getJobs();
  }, []);

  const deleteJob = async (id: string) => {
    try {
      const res = await axios.post("/api/job/return", { id });
    } catch {
      return toast.error("Sorry, something went wrong.");
    } finally {
      onOpenChange();
      router.refresh();
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Archived Job Listings
        </h1>

        <div className="grid gap-6">
          {jobs?.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-gray-500 text-center">
              No Archived Job Listings
            </div>
          ) : (
            jobs?.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <Link
                      className="flex-1"
                      href={`/job/${job.id}`}
                    >
                      <div className="flex gap-4 items-start">
                        <User
                          avatarProps={{
                            src: `https://econnectbucket.s3.amazonaws.com/image/${job.postedById}`,
                            className: "w-12 h-12"
                          }}
                          className="transition-transform"
                          description={""}
                          name={""}
                        />
                        
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            {job.title}
                          </h2>
                          
                          <div className="text-gray-700 mb-4 line-clamp-2">
                            {parse(job.shortDescription)}
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium">
                              {job.jobType}
                            </span>
                            <span className="text-gray-600 text-sm flex items-center gap-1">
                              <FaLocationDot className="flex-shrink-0" />
                              {job.location}
                            </span>
                            <span className="text-gray-600 text-sm">
                              {job.createdAt}
                            </span>
                          </div>

                          <div className="mt-2 text-gray-500 text-sm">
                            {job.applicant.length > 100
                              ? "Over 100 applicants"
                              : job.applicant.length === 0
                              ? "No applicants"
                              : job.applicant.length === 1
                              ? "1 applicant"
                              : `${job.applicant.length} applicants`}
                          </div>
                        </div>
                      </div>
                    </Link>

                    <div className="flex justify-end lg:ml-4">
                      <Button
                        color="success"
                        className="text-white"
                        onPress={onOpen}
                      >
                        Re-Activate Listing
                      </Button>
                    </div>
                  </div>
                </div>

                <Modal
                  backdrop="opaque"
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                  classNames={{
                    backdrop: "bg-gray-900/50",
                  }}
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Re-Activate Job Listing
                        </ModalHeader>
                        <ModalBody>
                          <p className="text-gray-600">
                            By re-activating the job listing, it will be available to applicants. 
                            You can always archive this job listing again, or edit it in the Active Page.
                          </p>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            variant="light"
                            onPress={onClose}
                          >
                            Cancel
                          </Button>
                          <Button
                            color="success"
                            onClick={() => deleteJob(job.id)}
                          >
                            Re-Activate
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
