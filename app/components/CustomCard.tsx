import React from "react";
import { Card, Image } from "@nextui-org/react";
import { string } from "zod";

interface textProps {
  main: string;
  text: string;
  image: string;
}

export const CustomCard = ({ main, text, image }: textProps) => (
  <Card className="w-96 space-y-5 bg-transparent p-10" radius="lg">
    <div className="h-48 rounded-lg w-full flex justify-center">
      <Image src={image} alt="NextUI Album Cover" className="h-48" />
    </div>
    <div className="space-y-3">
      <div className="font-bold text-center">{main}</div>
      <div className="font-light text-center">{text}</div>
    </div>
  </Card>
);
