"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@nextui-org/react";

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
        const res = await axios.get("/api/user/notifications");
        setNotifications(res.data);
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
      await axios.post("/api/message/mark-as-read", { notificationId });
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
    <div className="flex flex-col items-center justify-center w-full p-4">
      <h1 className="text-2xl font-bold">Notifications</h1>

      {isLoading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <div className="w-full max-w-lg">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex justify-between items-center bg-gray-100 p-4 my-2 rounded-md shadow-sm"
            >
              <div>
                <p className="text-sm">{notification.content}</p>
                <p className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              <Button
                color="primary"
                size="sm"
                onPress={() => markAsRead(notification.id)}
              >
                Mark as Read
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
