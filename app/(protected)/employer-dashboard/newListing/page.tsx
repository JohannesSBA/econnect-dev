"use client";
import React, { FormEvent, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
// import UseAiListing from "../../components/functionComponents/AI/UseAiListing";
import JobTitle from "./JobTitle";
import JobDescription from "./JobDescription";
import LocationInputs from "./LocationInputs";
import PromotionOptions from "./PromotionOptions";

const NewJobListing = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [jobType, setJobType] = useState<string>("On Site");
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [stateP, setStateP] = useState<string>("");
  const [screeningQuestions, setScreeningQuestions] = useState<Record<string, string>>({});
  const [promotion, setPromotion] = useState<string>("Free");
  const [about, setAbout] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    const location = `${city}, ${country}, ${stateP}`;

    // Convert the structured screening question objects to properly formatted strings
    const formattedScreeningQuestions = Object.entries(screeningQuestions)
      .map(([key, value]) => {
        const questionData = value as unknown as { question: string; answer: string; type: string };
        return `!question_start!${key}: !questionContent!${questionData.question}!answerContent!${questionData.answer}!question_end!`;
      })
      .join(" ");

    const description = `${about} ${formattedScreeningQuestions}`;

    try {
      const res = await axios.post("/api/job/create", {
        title,
        description,
        shortDescription,
        jobType,
        location,
        promotion,
      });

      if (res.status !== 200) {
        toast.error("An error occurred");
      } else {
        toast.success("You have successfully created a new job listing.");
        setTimeout(() => {
          router.push("/employer-dashboard");
        }, 5000);
      }
    } catch (error) {
      toast.error("Failed to create job listing.");
    }
  };

  return (
    <div className="m-2 p-6 light flex w-full gap-2">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg grow">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Create a new Job Listing</h2>
                  {/* <UseAiListing 
  onGenerate={(data) => {
    setTitle(data.title);
    setAbout(data.description);
    setShortDescription(data.shortDescription);
    setJobType(data.jobType);
    if (data.city) setCity(data.city);
    if (data.country) setCountry(data.country);
    if (data.state) setStateP(data.state);
                }} 
              /> */}
              <JobTitle title={title} setTitle={setTitle} />
              <JobDescription  setShortDescriptions={setShortDescription} setAbout={setAbout} />
              <LocationInputs city={city} setCity={setCity} country={country} setCountry={setCountry} stateP={stateP} setStateP={setStateP} />
              <PromotionOptions promotion={promotion} setPromotion={setPromotion} />
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
              <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create</button>
            </div>
          </form>
        </div>
      </div>
      {/* Additional information section */}
      <div className="overflow-hidden bg-white shadow sm:rounded-lg w-60 h-fit">
        <div className="px-4 py-5 sm:p-6 flex flex-col h-fit gap-2">
          <h1 className="font-bold">Why ask screening questions?</h1>
          <p className="flex-wrap font-light text-left text-sm">
            You will be informed of candidates who pass your screening questions, and your job posting is sent to those who meet your standards. Along with our AI tool, we can fast-track the application process for you!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewJobListing;
