import { z } from "zod";

export const messageValidator = z.object({
  id: z.string(),
  text: z.string(),
  image: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  seenIds: z.string(),
  recipientId: z.string(),
  senderId: z.string(),
  senderName: z.string(),
});

interface Comments {
  id: number;
  user: string;
  text: string;
  timestamp: string;
  isAuthor?: boolean;
}

export const messageArrayValidator = z.array(messageValidator);

export type Message = z.infer<typeof messageValidator>;
