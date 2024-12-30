import { Card, Button, Link } from "@nextui-org/react";
import React from "react";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa6";

const listOfLinks = [
  ["LinkedIn", FaLinkedin, "https://Www.linkedIn.com/econnect"],
  [
    "Instagram",
    FaInstagram,
    "https://www.instagram.com/ethiopiaconnect?igsh=MWsydGJ4dDRjMm8wcw==",
  ],
  [
    "Twitter",
    FaTwitter,
    "https://www.instagram.com/ethiopiaconnect?igsh=MWsydGJ4dDRjMm8wcw==",
  ],
  [
    "Facebook",
    FaFacebook,
    "https://www.instagram.com/ethiopiaconnect?igsh=MWsydGJ4dDRjMm8wcw==",
  ],
];

const pages = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 space-y-6">
        <h1 className="text-center text-3xl font-bold text-indigo-700">
          Thank You for Pre-registering!
        </h1>
        <h1 className="text-center text-gray-600">
          We&apos;re excited to have you on board with Econnect. You&apos;ll
          receive an email when the full app is released.
        </h1>
        <h1 className="text-center text-gray-600">
          In the meantime, follow us on social media for updates:
        </h1>
        <div className="flex justify-center gap-3 scale-125">
          {listOfLinks.map(([title, Icon, link], index) => (
            <Link
              key={index}
              href={link as string}
              className="flex items-center space-x-2"
            >
              <Icon className="text-indigo-700" />
              {/* <span>{title as string}</span> */}
            </Link>
          ))}
        </div>
        <p className="text-xs text-center text-gray-400">
          You can also check out our blog{" "}
          <a
            target="_blank"
            href="https://medium.com/@Econnect"
            className="text-blue-400 hover:text-blue-700 underline"
          >
            here
          </a>
        </p>
        <h1 className="text-center text-sm text-gray-500">
          We can&apos;t wait to connect with you!
        </h1>
      </Card>
    </div>
  );
};

export default pages;
