import { z } from "zod";

export const messageValidator = z.object({
  id: z.string(),
  body: z.string(),
  image: z.string(),
  createdAt: z.date(),
  seenIds: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
});

export const messageArrayValidator = z.array(messageValidator);

export type Message = z.infer<typeof messageValidator>;
