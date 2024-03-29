"use client";
import { FunctionComponent, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import axios from "axios";
import { IoIosSend } from "react-icons/io";
import { Button } from "@nextui-org/react";
import { toast } from "sonner";

interface ChatInputProps {
  chatPartner: string;
  chatId: string;
  chatRoom: string;
}

const ChatInput: FunctionComponent<ChatInputProps> = ({
  chatPartner,
  chatId,
  chatRoom,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const sendMessage = async () => {
    if (!input) return;
    setIsLoading(true);
    try {
      await axios.post("/api/message/send", {
        text: input,
        chatId: chatId,
        chatPartner: chatPartner,
        chatRoom: chatRoom,
      });
      setInput("");
      textareaRef.current?.focus();
    } catch {
      toast.error("Something went wrong. Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 px-4 py-4 mb-2 sm:mb-0">
      <div className="relative flex-1 overlow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-blue-600">
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Send a message`}
          className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 sm:padding-y-1.5 sm:text-sm sm:leading-6 outline-none p-2"
        />

        <div
          onClick={() => textareaRef.current?.focus()}
          className="py-2"
          aria-hidden="true"
        >
          <div className="py-px">
            <div className="h-9"></div>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <div className="flex-shrink-0">
            <Button
              onClick={sendMessage}
              isLoading={isLoading}
              color="primary"
              type="submit"
              isIconOnly
            >
              <IoIosSend />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
