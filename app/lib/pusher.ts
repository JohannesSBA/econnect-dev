// npm isntall pusher for serverside
// npm install pusher-js for clientside

import PusherServer from "pusher";
import PusherClient from "pusher-js";
import PusherPushNotifications from "@pusher/push-notifications-web";

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: "86f9e0cbdc7267622503",
  secret: process.env.PUSHER_APP_SECRET!,
  cluster: "us2",
  useTLS: true,
});

export const pusherClient = new PusherClient("86f9e0cbdc7267622503", {
  cluster: "us2",
  forceTLS: true,
});
