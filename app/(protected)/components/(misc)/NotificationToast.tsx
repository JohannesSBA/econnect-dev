"use client";
import { chatHrefConstructor } from "@/app/lib/utils";
import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

interface NotificationToastProps {
  sessionId: string;
  senderId: string;
  senderImg: string;
  senderName: string;
  senderMessage: string;
}

const NotificationToast: FC<NotificationToastProps> = ({
  senderId,
  sessionId,
  senderImg,
  senderName,
  senderMessage,
}) => {
  return (
    <div className=" w-96 absolute bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
      <a
        onClick={() => toast.dismiss()}
        href={`/chat/${chatHrefConstructor(sessionId, senderId)}`}
        className="flex-1 w-0 p-4"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <div className="relative h-10 w-10">
              <Image
                fill
                referrerPolicy="no-referrer"
                className="rounded-full"
                src={`https://econnectbucket.s3.amazonaws.com/image/${senderId}`}
                alt={`profilePictureAlt`}
              />
            </div>
          </div>

          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{"senderName"}</p>
            <p className="mt-1 text-sm text-gray-500">{senderMessage}</p>
          </div>
        </div>
      </a>

      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss()}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
