"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

interface userAboutProps {
  userInfo: any;
}

export default function UserAbout({ userInfo }: userAboutProps) {
  return (
    <div className="w-full h-full py-4 rounded-md shadow-sm flex justify-center">
      <Card className="w-full bg-transparent ml-6 p-2 flex justify-center">
        <CardHeader className="flex font-semibold justify-between">
          <p className="text-md">Education</p>
        </CardHeader>
        <CardBody>
          <li>
            <ul>
              <h1>Fordham University</h1>
              <p className="ml-2">Bachelors Degree</p>
              <p className="ml-2">GPA: 3.8</p>
            </ul>
            <ul>
              <h1>Intercnational Community Schoole</h1>
              <p className="ml-2">High School</p>
              <p className="ml-2">GPA: 3.8</p>
            </ul>
          </li>
        </CardBody>
      </Card>
    </div>
  );
}
