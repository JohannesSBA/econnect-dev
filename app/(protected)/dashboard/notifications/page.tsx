"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import parse from "html-react-parser";
import Image from "next/image";

interface Notification {
  id: string;
  content: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications on load
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await axios.get("/api/user/notification/all");

        setNotifications(JSON.parse(res.data));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await axios.post("/api/user/notification/mark-as-read", {
        notificationId,
      });
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== notificationId
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-4 h-full bg-zinc-100">
      <h1 className="text-2xl font-bold">Notifications</h1>

      {isLoading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <div className="w-full max-w-lg">
          {notifications.map((notification) => (
            <Card key={notification.id} className="mb-4 light">
              <CardHeader>
                <h2 className="text-lg font-semibold">
                  {new Date(notification.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </h2>
              </CardHeader>
              <CardBody>
                <div className="sm:flex">
                  <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                    <Image
                      src={`https://econnectbucket.s3.amazonaws.com/image/${parse(
                        notification.content
                          .split("$asq!")[1]
                          .split("message-")[0]
                      )}`}
                      width={50}
                      height={50}
                      className="h-12 w-12 rounded-full border-2 border-slate-400"
                      alt={""}
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">
                      {notification.content.split("$user!")[1]}
                    </h4>
                    <p className="mt-1">
                      {notification.content.includes("message-")
                        ? parse(
                            notification.content
                              .split("message-")[1]
                              .split("$user!")[0]
                          )
                        : ""}
                    </p>
                  </div>
                </div>

                <Button
                  color="primary"
                  size="sm"
                  className="my-2 mx-6"
                  onPress={() => markAsRead(notification.id)}
                >
                  Mark as Read
                </Button>
              </CardBody>
            </Card>
            // <div
            //   key={notification.id}
            //   className="flex justify-between items-center bg-gray-100 p-4 my-2 rounded-md shadow-sm"
            // >
            //   <div>
            //     <p className="text-sm">
            //       {notification.content.includes("message-")
            //         ? parse(notification.content.split("message-")[1])
            //         : ""}
            //     </p>
            //     <p className="text-xs text-gray-500">
            //       {new Date(notification.createdAt).toLocaleString()}
            //     </p>
            //   </div>
            //   <Button
            //     color="primary"
            //     size="sm"
            //     onPress={() => markAsRead(notification.id)}
            //   >
            //     Mark as Read
            //   </Button>
            // </div>
          ))}
        </div>
      )}
    </div>
  );
}
