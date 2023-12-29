"use client";
import axios from "axios";
import React, { FunctionComponent, useEffect, useState } from "react";
import Image from "next/image";
import { Avatar } from "@nextui-org/react";

interface conversationProps {
  chatPartner: string;
  chatId: string;
  partnerName: string;
  userName: string;
}

const Conversations: FunctionComponent<conversationProps> = ({
  chatPartner,
  chatId,
  partnerName,
  userName,
}) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await axios.post("/api/message/get", {
          chatPartner: chatPartner,
          chatId: chatId,
        });
        setMessages(res.data);
      } catch {
      } finally {
      }
    };

    getMessage();
  }, [chatId, chatPartner]);

  return (
    <div className="w-full flex flex-col">
      {messages.map(
        (message: {
          key: React.Key | string | null | undefined;
          createdAt: any;
          recipeintId: any;
          senderId: any;
          text: string;
        }) => (
          <div
            key={message.key}
            className={
              chatPartner === message.senderId
                ? "flex w-full justify-end"
                : "flex w-full justify-start"
            }
          >
            <div className="items-start flex gap-2.5">
              <div className="flex flex-col gap-1 w-full max-w-[320px]">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {chatPartner === message.senderId ? partnerName : userName}
                  </span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {new Date(message.createdAt).toLocaleTimeString("en-US")}
                  </span>
                </div>
                <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                  <p className="text-sm font-normal text-gray-900 dark:text-white">
                    {message.text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Conversations;
