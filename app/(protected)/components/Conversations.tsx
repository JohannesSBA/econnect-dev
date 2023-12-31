"use client";
import axios from "axios";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { pusherClient } from "@/app/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/app/lib/utils";
import { z } from "zod";
import { messageValidator } from "@/app/lib/validation";
import { toast } from "sonner";

interface conversationProps {
  chatPartner: string;
  chatId: string;
  chatRoom: string;
}

type Message = z.infer<typeof messageValidator>;

const Conversations: FunctionComponent<conversationProps> = ({
  chatPartner,
  chatId,
  chatRoom,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await axios.post("/api/message/get", {
          chatPartner: chatPartner,
          chatId: chatId,
        });
        setMessages(res.data);
      } catch {
        return toast.error(
          "Sorry, Message did not send. Please try again later."
        );
      }
    };

    getMessage();
  }, [chatId, chatPartner]);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatRoom}`));

    const messageHandler = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    pusherClient.bind("incoming-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatRoom}`));
      pusherClient.unbind("incoming-message", messageHandler);
    };
  }, [chatRoom]);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollDownRef.current) {
      scrollDownRef.current.scrollIntoView();
    }
  }, [messages]);

  return (
    <div
      className="w-full max-h-full px-4 overflow-scroll flex flex-col"
      id="messages"
    >
      {messages.map((message, index) => {
        const isCurrentUser = chatPartner !== message.senderId;
        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId;

        return (
          <div
            key={message.id}
            className={
              !isCurrentUser
                ? "flex w-full justify-start my-1"
                : "flex w-full justify-end my-1"
            }
          >
            <div className="items-start flex gap-2.5">
              <div className="flex flex-col gap-1 w-full max-w-[320px]">
                {hasNextMessageFromSameUser ? (
                  ""
                ) : (
                  <div className="flex items-center space-x-2"></div>
                )}
                <div
                  className={
                    isCurrentUser
                      ? "flex flex-col leading-1.5 p-2 border-gray-200 bg-blue-500 rounded-s-xl rounded-se-xl "
                      : "flex flex-col leading-1.5 p-2 border-gray-200 bg-slate-200 rounded-e-xl rounded-es-xl "
                  }
                >
                  <span
                    className={
                      isCurrentUser
                        ? "py-2 rounded-lg w-full text-white"
                        : "py-2 rounded-lg w-full"
                    }
                  >
                    {message.text}{" "}
                  </span>
                  <span
                    className={
                      isCurrentUser
                        ? "ml-2 text-[10px] p-1 text-gray-300 realtive right-0 w-full text-right"
                        : "ml-2 text-[10px] p-1 text-gray-400 realtive right-0 w-full text-right"
                    }
                  >
                    {new Date(message.createdAt).toLocaleTimeString("en-US")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div ref={scrollDownRef} />
    </div>
  );
};

export default Conversations;
