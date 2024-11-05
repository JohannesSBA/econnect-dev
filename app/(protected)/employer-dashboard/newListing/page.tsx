"use client";
import React, { FormEvent, useState } from "react";
import { BiPencil } from "react-icons/bi";
import { toast } from "sonner";
import axios from "axios";
import { IoIosAdd } from "react-icons/io";
import { FaCheck, FaPlus } from "react-icons/fa";
import { Checkbox, Input } from "@nextui-org/react";
import TextStyle from "@tiptap/extension-text";
import ListItem from "@tiptap/extension-list-item";
import { EditorProvider, useCurrentEditor, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import QuestionSelector from "./screenQ";
import { useRouter } from "next/navigation";

const NewJobListing = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [jobType, setJobType] = useState<string>("On Site");
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [stateP, setStateP] = useState<string>("");
  const [screeningQuestions, setScreeningQuestions] = useState<
    Record<string, string>
  >({});
  const [promotion, setPromotion] = useState<string>("Free");
  const [about, setAbout] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    const location = `${city}, ${country}, ${stateP}`;

    // Convert screening questions to a formatted string with delimiters
    const formattedScreeningQuestions = Object.entries(screeningQuestions)
      .map(([key, value]) => `!question_start!${key}: ${value}!question_end!`)
      .join(" ");

    // Combine the job description with screening questions
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
        toast.error("an error occured");
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

  const MenuBar = () => {
    const { editor } = useCurrentEditor();
    if (!editor) return null;
    setShortDescription(editor.getHTML());

    const handleButtonClick = (action: () => void) => {
      action();
    };

    return (
      <div className="text-black shadow-md p-2 bg-white flex gap-2 mb-4">
        <button
          onClick={() =>
            handleButtonClick(() => editor.chain().focus().toggleBold().run())
          }
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("bold") ? "bg-gray-300" : ""
          }`}
        >
          B
        </button>
        <button
          onClick={() =>
            handleButtonClick(() => editor.chain().focus().toggleItalic().run())
          }
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("italic") ? "bg-gray-300" : ""
          }`}
        >
          Italic
        </button>
        <button
          onClick={() =>
            handleButtonClick(() => editor.chain().focus().toggleStrike().run())
          }
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("strike") ? "bg-gray-300" : ""
          }`}
        >
          strike
        </button>
        <button
          onClick={() =>
            handleButtonClick(() => editor.chain().focus().undo().run())
          }
        >
          undo
        </button>
        <button
          onClick={() =>
            handleButtonClick(() => editor.chain().focus().redo().run())
          }
        >
          redo
        </button>
      </div>
    );
  };

  const extensions = [
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false,
      },
    }),
  ];

  const screenQ = [
    {
      name: "GPA",
      question: "What is the minimum GPA for the applicants?",
      input: "number",
    },
    {
      name: "Languages",
      question:
        "What languages are required for this job? Separate them using commas (e.g. English, Amharic, French)",
      input: "text",
      options: [""],
    },
    {
      name: "Experience",
      question: "How many years of experience do you have?",
      input: "text",
      idealNumber: "number",
    },
    {
      name: "Location",
      question: "Are you comfortable relocating to the job's location?",
      input: "checkbox",
      options: ["Yes", "No"],
    },
    {
      name: "Urgent Hire",
      question:
        "We must fill this position urgently. Can you start immediately?",
      input: "checkbox",
      options: ["Yes", "No"],
    },
  ];

  return (
    <div className="m-2 p-6 light flex w-full gap-2">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg grow">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Create a new Job Listing
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  You will receive an email notification when you receive 10+
                  applications.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Title
                    </label>
                    <div className="mt-2">
                      <Input
                        isRequired
                        defaultValue={title}
                        className="my-2"
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      What is the title for this job listing?
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Job Description
                </h2>
                <p className="text-xs">Screening Questions (optional)</p>
                <QuestionSelector
                  screenQ={screenQ}
                  setScreeningQuestions={setScreeningQuestions}
                />

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="Description"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Description
                    </label>
                    <div className="mt-2 w-full">
                      <EditorProvider
                        slotBefore={<MenuBar />}
                        extensions={extensions}
                      ></EditorProvider>
                    </div>
                  </div>
                  <div className="sm:col-span-2 sm:col-start-1">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      City
                    </label>
                    <div className="mt-2">
                      <input
                        id="city"
                        name="city"
                        type="text"
                        onChange={(e) => setCity(e.target.value)}
                        autoComplete="address-level2"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2 sm:col-start-1">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Country
                    </label>
                    <div className="mt-2">
                      <input
                        id="country"
                        name="country"
                        type="text"
                        onChange={(e) => setCountry(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="jobType"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Job Type
                    </label>
                    <div className="mt-2">
                      <select
                        id="jobType"
                        name="jobType"
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="On Site">On Site</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      State / Province
                    </label>
                    <div className="mt-2">
                      <input
                        id="state"
                        name="state"
                        type="text"
                        onChange={(e) => setStateP(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Promotion
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Promoite your job listing to get more views and potential
                applicants for you listing
              </p>

              <div className="flex rounded-md p-2 m-2 gap-4">
                <div className="flex flex-col">
                  <div className="flex">
                    <Checkbox
                      isSelected={promotion === "Free"}
                      onChange={() => setPromotion("Free")}
                    />
                    <h1>Free</h1>
                  </div>
                  <ul>
                    <li className="flex text-center items-center gap-2 pt-3">
                      <FaCheck className="text-green-500" />
                      <p>Shows up in search Results</p>
                    </li>
                  </ul>
                </div>
                <div className="inline-block h-[250px] min-h-[1em] w-0.5 self-stretch bg-white/10"></div>
                <div className="flex flex-col">
                  <div className="flex">
                    <Checkbox
                      isSelected={promotion === "Promoted"}
                      onChange={() => setPromotion("Promoted")}
                    />
                    <h1>Promoted</h1>
                  </div>
                  <ul>
                    <p className="font-extralight text-xs">Currently Free</p>
                    <li className="flex text-center items-center gap-2">
                      <FaCheck className="text-green-500" />
                      <p>Shows up in search Results</p>
                    </li>
                    <li className="flex text-center items-center gap-2 pt-3">
                      <FaCheck className="text-green-500" />
                      <p>Get notified when a candidate applies</p>
                    </li>
                    <li className="flex text-center items-center gap-2 pt-3">
                      <FaCheck className="text-green-500" />
                      <p>
                        Get more qualified applicants, with no applicant limit
                        Top placement in search and job recommendations
                      </p>
                    </li>
                    <li className="flex text-center items-center gap-2 pt-3">
                      <FaCheck className="text-green-500" />
                      <p>
                        Send instant mobile alerts to qualified candidates in
                        your location
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="overflow-hidden bg-white shadow sm:rounded-lg w-60 h-fit">
        <div className="px-4 py-5 sm:p-6 flex flex-col h-fit gap-2">
          <h1 className="font-bold">Why ask screening questions?</h1>
          <p className="flex-wrap font-light text-left text-sm">
            You will be informed of candidates who pass your screening
            questions, and your job posting is sent to those who meet your
            standards. Along with our AI tool, we can fast-track the application
            process for you!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewJobListing;
