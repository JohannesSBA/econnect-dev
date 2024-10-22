"use client";
import React from "react";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { AiOutlinePaperClip } from "react-icons/ai";

interface ClientComponentProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
  };
  listing: {
    title: string;
  };
  listingId: string;
  applicantId: string;
}

const ClientComponent: React.FC<ClientComponentProps> = ({
  user,
  listing,
  listingId,
  applicantId,
}) => {
  const handleAccept = async () => {
    try {
      await axios.post("/api/job/accept", {
        listing: listingId,
        user: applicantId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeny = async () => {
    try {
      await axios.post("/api/job/deny", {
        listing: listingId,
        user: applicantId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="overflow-scroll h-screen w-screen bg-white shadow sm:rounded-lg m-2 p-2">
      <div className="px-4 py-6 sm:px-6">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Applicant Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Personal details and application.
        </p>
      </div>
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Full name</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {user.firstName + " " + user.lastName}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">
              Application for
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {listing?.title}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Email address</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {user.email}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">About</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {user.bio}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Attachments
            </dt>
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul
                role="list"
                className="divide-y divide-gray-100 rounded-md border border-gray-200"
              >
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                  <div className="flex w-0 flex-1 items-center">
                    <AiOutlinePaperClip
                      aria-hidden="true"
                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                    />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">
                        {user.firstName + " " + user.lastName + "'s Resume"}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a
                      href={`https://econnectbucket.s3.amazonaws.com/resume/${user.id}`}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                      target="_blank"
                    >
                      View
                    </a>
                  </div>
                </li>
              </ul>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between">
            <dt className="text-sm font-medium text-gray-900">Actions</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 flex gap-2">
              <Button
                color="primary"
                onPress={() => {
                  handleAccept();
                }}
              >
                Accept
              </Button>
              <Button
                color="danger"
                onPress={() => {
                  handleDeny();
                }}
              >
                Deny
              </Button>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ClientComponent;
