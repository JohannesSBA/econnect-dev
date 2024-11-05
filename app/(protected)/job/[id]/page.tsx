"use client";
import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
  ModalHeader,
  Avatar,
  Input,
  Checkbox,
} from "@nextui-org/react";
import parse from "html-react-parser";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { MdOutlinePictureAsPdf } from "react-icons/md";

const Page = ({ params }: { params: { id: string } }) => {
  const [listing, setListing] = useState<any>();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [newCoverLetter, setNewCoverLetter] = useState<File | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchListingData = async () => {
      try {
        const { data } = await axios.post("/api/job/listing", {
          id: params.id,
        });
        setListing(data);
      } catch {
        toast.error("Failed to load listing data");
      }
    };
    fetchListingData();
  }, [params.id]);

  const handleResponseChange = (name: string, value: string) => {
    setResponses((prev) => ({ ...prev, [name]: value }));
  };

  const formHandler = async () => {
    if (!newCoverLetter) {
      toast.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("newCoverLetter", newCoverLetter, newCoverLetter.name);

    try {
      await axios.post("/api/s3-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        params: { id: params.id },
      });
      toast.success("Cover letter uploaded successfully");
    } catch {
      toast.error("Failed to upload cover letter");
    }
  };

  const handleSubmit = async () => {
    try {
      const applicationData = { listingId: params.id, responses };
      const res = await axios.post("/api/job/apply", applicationData);
      if (res.status === 200)
        toast.success("Application submitted successfully!");
    } catch (e: Error | any) {
      toast.error(e.response.data);
    } finally {
      setTimeout(() => {
        onOpenChange();
      }, 2000);
    }
  };

  const renderScreeningQuestions = () => {
    if (!listing?.description) return null;

    const questions = listing.description
      .split("!question_start!")
      .filter((q: string) => q.includes("!sq_as;!;!question_end!"))
      .map((q: string) => q.split("!sq_as;!;!question_end!")[0]);

    return questions.map((questionText: string, index: any) => {
      const name = `question_${index}`;
      const isCheckbox =
        questionText.includes("Yes") || questionText.includes("No");
      const isNumber =
        questionText.includes("GPA") || questionText.includes("experience");

      return (
        <div key={name} className="mb-4">
          <label className="block font-semibold text-gray-700 mb-2">
            {questionText}
          </label>
          {isCheckbox ? (
            <div className="flex gap-4">
              <Checkbox
                isSelected={responses[name] === "Yes"}
                onChange={(checked) =>
                  handleResponseChange(name, checked ? "Yes" : "No")
                }
              >
                Yes
              </Checkbox>
              <Checkbox
                isSelected={responses[name] === "No"}
                onChange={(checked) =>
                  handleResponseChange(name, checked ? "No" : "Yes")
                }
              >
                No
              </Checkbox>
            </div>
          ) : isNumber ? (
            <Input
              type="number"
              placeholder="Enter value"
              value={responses[name] || ""}
              onChange={(e) => handleResponseChange(name, e.target.value)}
            />
          ) : (
            <Input
              type="text"
              placeholder="Enter your answer"
              value={responses[name] || ""}
              onChange={(e) => handleResponseChange(name, e.target.value)}
            />
          )}
        </div>
      );
    });
  };

  return (
    <div className="bg-zinc-100 overflow-x-clip">
      <header className="relative isolate pt-16">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute left-16 top-full -mt-16 opacity-50 blur-3xl xl:left-1/2 xl:-ml-80">
            <Avatar
              src={`https://econnectbucket.s3.amazonaws.com/image/${listing?.postedBy.id}`}
              className="w-10 h-10 md:w-40 md:h-40"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gray-900/5" />
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-x-8 max-w-2xl mx-auto lg:max-w-none">
            <div className="flex items-center gap-x-6">
              <Avatar
                src={`https://econnectbucket.s3.amazonaws.com/image/${listing?.postedBy.id}`}
                className="w-40 h-40 text-large"
              />
              <div className="flex flex-col text-wrap">
                <h1 className="text-black font-bold text-xl">
                  {listing?.title}
                </h1>
                <p className="text-gray-600">
                  Job <span className="text-gray-500">#{listing?.id}</span>
                </p>
                <div className="text-base font-semibold text-gray-900">
                  {listing?.postedBy.firstName}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-x-4 sm:gap-x-6">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.message("URL copied to clipboard!");
                }}
              >
                Copy URL
              </Button>
              <Link
                href={`/ec/${listing?.postedBy.id}`}
                className="text-sm font-semibold text-gray-900 hover:text-indigo-500"
              >
                Company page
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 w-full h-96 overflow-scroll shadow-sm ring-1 ring-gray-900/5 p-2 bg-gray-50 rounded-md">
            <h2 className="text-base font-semibold text-gray-900">
              Job Description
            </h2>
            <p className="mt-2 text-gray-500">
              {parse(listing?.shortDescription || "")}
            </p>
          </div>
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5 p-6">
              <h3 className="font-light">
                Click below to start your application!
              </h3>
              <Button onPress={onOpen} className="mt-6 w-full">
                Apply
              </Button>
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent className="overflow-scroll">
                <ModalHeader className="flex flex-col gap-1 text-black">
                  Apply Now
                </ModalHeader>
                <ModalBody>
                  {renderScreeningQuestions()}
                  <div className="mt-4">
                    <label className="block font-medium text-gray-900">
                      Cover Letter
                    </label>
                    <div className="mt-2 flex justify-center border border-dashed px-6 py-10">
                      <MdOutlinePictureAsPdf
                        className={`h-12 w-12 ${
                          newCoverLetter ? "text-black" : "text-gray-300"
                        }`}
                      />
                      <label className="cursor-pointer text-indigo-600 ml-4">
                        {newCoverLetter ? newCoverLetter.name : "Upload a file"}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) =>
                            setNewCoverLetter(e.target.files?.[0] || null)
                          }
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      PDF, DOC, DOCX up to 10MB
                    </p>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button onPress={onOpenChange}>Close</Button>
                  <Button onPress={handleSubmit}>Submit</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
