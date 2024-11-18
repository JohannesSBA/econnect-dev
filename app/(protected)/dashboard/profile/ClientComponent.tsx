"use client";

import { useState } from "react";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import {
  MdLocationOn,
  MdEmail,
  MdPhone,
  MdFileDownload,
  MdPinDrop,
} from "react-icons/md";
import { Link } from "@nextui-org/react";
import UploadResume from "../../components/functionComponents/UploadResume";
import NewExperience from "../../components/functionComponents/NewExperience";
import NewEducation from "../../components/functionComponents/NewEducation";

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    title: string;
    location: string;
    about: string;
  };
  experiences: any[];

  education: any[];
  skills: any[];
  contact: {
    email: string;
    phone: string;
  };
  languages: string[];
}

export default function UserProfile(UserProfile: UserProfileProps) {
  console.log(UserProfile);

  const [experiences, setExperiences] = useState(UserProfile.experiences);
  const [education, setEducation] = useState(UserProfile.education);

  // async function deleteExperience(index: number) {
  //   toast.loading("Deleting experience");
  //   try {
  //     await axios.post("/api/user/experience/delete", {
  //       id: experiences[index].id,
  //     });
  //     setExperiences((prevExperiences) =>
  //       prevExperiences.filter((_, i) => i !== index)
  //     );
  //     toast.success("Experience deleted successfully");
  //   } catch (error) {
  //     console.log("Error", error);
  //     toast.error("Failed to delete experience, Try again later.");
  //   } finally {
  //     toast.dismiss();
  //   }
  // }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Header */}
          <Card>
            <CardBody className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <Avatar
                  src={
                    "https://econnectbucket.s3.amazonaws.com/image/" +
                    UserProfile.user.id
                  }
                  className="w-32 h-32"
                  alt={UserProfile.user.name}
                />
                <div className="text-center md:text-left flex-grow">
                  <h1 className="text-3xl font-bold">
                    {UserProfile.user.name}
                  </h1>
                  <p className="text-xl text-default-500">
                    {UserProfile.user.title}
                  </p>
                  <p className="flex items-center justify-center md:justify-start mt-2 text-sm text-default-500">
                    <MdLocationOn className="mr-2 h-4 w-4" />
                    {UserProfile.user.location}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* About */}
          <Card>
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-lg font-bold">About</p>
              </div>
            </CardHeader>
            <CardBody>
              <p>{UserProfile.user.about}</p>
            </CardBody>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <p className="text-lg font-bold">Experience</p>
              <NewExperience />
            </CardHeader>
            <CardBody className="space-y-6">
              {experiences.length === 0
                ? "No Experiences to display"
                : experiences.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{exp.title}</h3>
                          <p className="text-xs ml-2">{exp.companyName}</p>
                          <p className="text-sm text-default-500">
                            {new Date(exp.startDate).toLocaleDateString()} -{" "}
                            {exp.endDate === null
                              ? "Present"
                              : new Date(exp.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          {/* <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        aria-label="Delete experience"
                        onPress={() => deleteExperience(index)}
                      >
                        <MdDelete className="h-5 w-5" />
                      </Button> */}
                        </div>
                      </div>
                      <ul className="list-disc list-inside mt-2 text-sm">
                        {exp.description
                          .split("\n")
                          .map((desc: string, descIndex: number) => (
                            <li key={descIndex}>{desc}</li>
                          ))}
                      </ul>
                      {index < experiences.length - 1 && (
                        <Divider className="my-4" />
                      )}
                      {experiences.length === 0
                        ? "No Expereicnes available"
                        : ""}
                    </div>
                  ))}
            </CardBody>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <p className="text-lg font-bold">Education</p>
              <NewEducation />
            </CardHeader>
            <CardBody>
              {education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold">{edu.school}</h3>
                  <p className="text-sm text-default-500">
                    {edu.degree} Degree,{" "}
                    {new Date(edu.startDate).toLocaleDateString()} -{" "}
                    {edu.endDate === null
                      ? "Present"
                      : new Date(edu.endDate).toLocaleDateString()}
                  </p>
                  <p>GPA: {edu.GPA}</p>
                  <ul className="list-disc list-inside mt-2 text-sm">
                    {edu.description !== null && edu.description !== undefined
                      ? edu.description
                          .split("\n")
                          .map((desc: string, descIndex: number) => (
                            <li key={descIndex}>{desc}</li>
                          ))
                      : ""}
                  </ul>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Skills */}
          <Card>
            {/* <CardHeader className="flex justify-between items-center">
              <p className="text-lg font-bold">Skills</p>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={addSkill}
                aria-label="Add skill"
              >
                <MdAdd className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Chip key={index} variant="flat" color="primary">
                    {skill}
                  </Chip>
                ))}
              </div>
            </CardBody> */}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-lg font-bold">Contact Information</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-2">
              <p className="flex items-center">
                <MdEmail className="mr-2 h-5 w-5" />
                {UserProfile.contact.email}
              </p>
              <p className="flex items-center">
                <MdPhone className="mr-2 h-5 w-5" />
                {UserProfile.contact.phone}
              </p>
              <p className="flex items-center">
                <MdPinDrop className="mr-2 h-5 w-5" />
                {UserProfile.user.location}
              </p>
            </CardBody>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-lg font-bold">Languages</p>
              </div>
            </CardHeader>
            {/* <CardBody>
              <ul className="space-y-2">
                {profile.languages.map((language, index) => (
                  <li key={index}>{language}</li>
                ))}
              </ul>
            </CardBody> */}
          </Card>

          {/* Resume Download */}
          <Card>
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-lg font-bold">Resume</p>
              </div>
            </CardHeader>
            <CardBody>
              <Button
                as={Link}
                href={`https://econnectbucket.s3.amazonaws.com/resume/${UserProfile.user.id}`}
                color="primary"
                className="w-full"
                target="_blank"
              >
                <MdFileDownload className="mr-2 h-5 w-5" />
                View Resume
              </Button>
              <UploadResume />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
