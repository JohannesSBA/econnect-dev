"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Button,
} from "@nextui-org/react";

export default function UserAbout() {
  const [showMore, setShowMore] = useState<boolean>(false);

  return (
    <Card className="w-80 md:w-[600px] bg-transparent ml-6">
      <CardHeader className="flex border-2 font-semibold">
        <p className="text-md">About</p>
      </CardHeader>
      <CardBody
        className={showMore ? "h-full overflow-scroll" : "h-24 overflow-hidden"}
      >
        <p className="md:text-base text-xs">
          I apply my analytical and problem-solving skills to find robust
          solutions. By understanding the needs and requirements of users, I
          develop software solutions that meet their needs and build deeper
          connections with them. My experience in various internships and
          projects has helped me develop adaptability, communication skills, and
          critical thinking skills. It has shown me how passionate I am about a
          career in computer science. I particularly enjoy working in teams to
          brainstorm ideas and find the most effective approach to building
          software solutions. Specifically, my strongest suit lies in developing
          software using different frameworks and my excitement about computer
          science&apos;s continuous advancements and new possibilities. I look
          forward to contributing my skills to the industry. When I am not
          occupied working on my portfolio, school, and job search, I advance my
          physical health through exercise, spending time with friends and
          family, discovering new restaurants in my city, and playing
          competitive video games.
        </p>
      </CardBody>
      <CardFooter className="flex justify-end">
        <Button variant="light" onClick={() => setShowMore(!showMore)}>
          {showMore ? "Show Less" : "Show More"}
        </Button>
      </CardFooter>
    </Card>
  );
}
