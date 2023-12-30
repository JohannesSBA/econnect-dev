// npm isntall pusher for serverside
// npm install pusher-js for clientside

import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_APP_KEY!,
  secret: process.env.PUSHER_APP_SECRET!,
  cluster: "mt1",
  useTLS: true,
});

export const pusherClient = new PusherClient("cc883f8f5eca615325ac", {
  cluster: "mt1",
});
