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
  Skeleton,
} from "@nextui-org/react";
import parse from "html-react-parser";
import axios from "axios";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { MdOutlinePictureAsPdf } from "react-icons/md";
import { FaLink, FaBuilding } from "react-icons/fa";

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
      const isCheckbox = questionText.includes("Yes") || questionText.includes("No");
      const isNumber = questionText.includes("GPA") || questionText.includes("experience");

      if (questionText.includes("GPA")) {
        questionText = questionText.replace("GPA", "What is your GPA?");
      }

      if (questionText.includes("experience")) {
        questionText = questionText.replace(
          "experience",
          "How many years of experience do you have?"
        );
      }
      return (
        <div key={name} className="mb-6">
          <label className="block font-medium text-gray-800 mb-2">
            {questionText}
          </label>
          {isCheckbox ? (
            <div className="flex gap-6">
              <Checkbox
                isSelected={responses[name] === "Yes"}
                onChange={(checked) =>
                  handleResponseChange(name, checked ? "Yes" : "No")
                }
                className="text-gray-700"
              >
                Yes
              </Checkbox>
              <Checkbox
                isSelected={responses[name] === "No"}
                onChange={(checked) =>
                  handleResponseChange(name, checked ? "No" : "Yes")
                }
                className="text-gray-700"
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
              className="w-full"
            />
          ) : (
            <Input
              type="text"
              placeholder="Enter your answer"
              value={responses[name] || ""}
              onChange={(e) => handleResponseChange(name, e.target.value)}
              className="w-full"
            />
          )}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      <header className="relative isolate pt-8 md:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <Suspense fallback={
                  <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
                }>
                  <Avatar
                    src={`https://econnectbucket.s3.amazonaws.com/image/${listing?.postedBy.id}`}
                    className="w-24 h-24 md:w-32 md:h-32 text-large"
                  />
                </Suspense>
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {listing?.title}
                  </h1>
                  <p className="text-gray-600">
                    Posted by {listing?.postedBy.firstName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Job ID: {listing?.id}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.message("URL copied to clipboard!");
                  }}
                  className="bg-blue-600 text-white"
                  startContent={<FaLink />}
                >
                  Share Job
                </Button>
                <Button
                  as={Link}
                  href={`/ec/${listing?.postedBy.id}`}
                  className="bg-gray-100"
                  startContent={<FaBuilding />}
                >
                  View Company
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Job Description
              </h2>
              <div className="prose max-w-none text-gray-600">
                {parse(listing?.shortDescription || "")}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Ready to Apply?
              </h3>
              <p className="text-gray-600 mb-6">
                Take the next step in your career journey
              </p>
              <Button 
                onPress={onOpen} 
                className="w-full bg-blue-600 text-white text-lg py-6"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="text-2xl font-semibold text-gray-900">
            Submit Your Application
          </ModalHeader>
          <ModalBody className="px-6">
            {renderScreeningQuestions()}
            <div className="mt-8">
              <label className="block font-medium text-gray-900 mb-4">
                Upload Cover Letter
              </label>
              <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg px-6 py-8 hover:border-gray-400 transition-colors">
                <MdOutlinePictureAsPdf
                  className={`h-12 w-12 ${
                    newCoverLetter ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                <label className="mt-4 cursor-pointer text-blue-600 hover:text-blue-700">
                  {newCoverLetter ? newCoverLetter.name : "Choose a file"}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) =>
                      setNewCoverLetter(e.target.files?.[0] || null)
                    }
                  />
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  PDF, DOC, DOCX up to 10MB
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onOpenChange} className="bg-gray-100">
              Cancel
            </Button>
            <Button onPress={handleSubmit} className="bg-blue-600 text-white">
              Submit Application
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Page;
