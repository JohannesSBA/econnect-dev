"use client";
import { getUserContent } from "@/app/helpers/getUser";
import {
  Button,
  Card,
  Checkbox,
  Image,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
  ModalHeader,
  Skeleton,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaBriefcase } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const Loading = () => {
  return (
    <div className="w-screen h-screen bg-white flex ">
      <div className="absolute flex right-0 w-[calc(100vw-25rem)] h-[calc(100vh-5rem)] items-end overflow-scroll">
        <div className="w-2/3 h-full overflow-scroll flex flex-col p-8 border-l">
          <Skeleton className="flex w-96 h-12" />
          <div className="w-full flex flex-col gap-2 py-2 my-4">
            <Skeleton className="flex w-44 h-6" />
            <div className="flex gap-8 text-slate-500">
              <Skeleton className="flex w-full h-24" />
            </div>
          </div>
          <Skeleton className="flex w-96 h-12" />
        </div>
        <div className="w-1/3 h-full overflow-scroll flex flex-col justify-start items-center p-16">
          <Skeleton className="flex w-44 h-36" />
          <h1 className="font-bold text-xl text-black flex flex-col items-center mt-4 gap-8">
            <Skeleton className="flex w-24 h-6" />
            <Skeleton className="flex w-44 h-44" />
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Loading;
