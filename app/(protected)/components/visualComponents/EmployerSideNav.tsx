"use client";
import { Tooltip } from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
    FaArchive,
    FaBriefcase,
    FaChartBar,
    FaHome,
    FaList,
    FaNetworkWired,
} from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa6";
import { GiWaterDrop } from "react-icons/gi";
import { IoIosSend } from "react-icons/io";
import { IoHome } from "react-icons/io5";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

interface pageProps {
    userInfo: any;
    userId: string;
}

export default function App({ userInfo, userId }: pageProps) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [messageCounter, setMessageCounter] = useState(0); // New state for unread message count
    const [notificationCounter, setNotificationCounter] = useState(0); // New state for unread notification count
    const path = usePathname();

    const navigation = [
        {
            name: "Dashboard",
            href: "/employer-dashboard/home",
            icon: FaHome,
            current: path === "/employer-dashboard/home",
        },
        {
            name: "Listings",
            href: "/employer-dashboard",
            icon: FaList,
            current: path === "/employer-dashboard",
        },
        {
            name: "Active Listings",
            href: "/employer-dashboard/jobs_active",
            icon: FaBriefcase,
            // count: "12",
            current: path === "/employer-dashboard/jobs_active",
        },
        {
            name: "Messaging",
            href: "/chat",
            icon: FaEnvelope,
            // count: "12",
            current: false,
        },
        {
            name: "Archived Listings",
            href: "/employer-dashboard/archived",
            icon: FaArchive,
            // count: "12",
            current: path === "/employer-dashboard/archived",
        },

        { name: "Reports", href: "/employer-dashboard/reports", icon: FaChartBar, current: false },
    ];

    // Function to fetch unread messages count
    const fetchUnreadMessages = async () => {
        try {
            const response = await axios.get("/api/message/unread"); // Replace with your API route to get unread messages
            setMessageCounter(response.data.unreadCount); // Assuming your API returns an `unreadCount` field
        } catch (error) {
            console.error("Error fetching unread messages:", error);
        }
    };

    // Fetch unread messages count when component mounts
    useEffect(() => {
        fetchUnreadMessages();

        // Optionally, set up a polling or real-time mechanism (e.g., using Pusher) to update the counter.
        // Example with polling every 60 seconds:
        const interval = setInterval(fetchUnreadMessages, 30000); // Poll every 30 seconds
        return () => clearInterval(interval); // Cleanup the interval on unmount
    }, []);
    const fetchNotifications = async () => {
        try {
            const response = await axios.get("/api/user/notification/unread"); // Replace with your API route to get unread messages
            setNotificationCounter(response.data.unreadCount); // Assuming your API returns an `unreadCount` field
        } catch (error) {
            console.error("Error fetching unread messages:", error);
        }
    };

    // Fetch unread messages count when component mounts
    useEffect(() => {
        fetchNotifications();

        // Optionally, set up a polling or real-time mechanism (e.g., using Pusher) to update the counter.
        // Example with polling every 60 seconds:
        const interval = setInterval(fetchUnreadMessages, 30000); // Poll every 30 seconds
        return () => clearInterval(interval); // Cleanup the interval on unmount
    }, []);
    return (
      
        <div className="flex sticky flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white p-2 md:p-6 h-screen md:w-[20rem]">
            <div className="flex items-center h-16 px-4 bg-white border-b">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-semibold">E</span>
                    </div>
                    <span className="text-xl font-semibold hidden md:flex">
                        Econnect
                    </span>
                </div>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto">
                <nav className="flex-1 md:px-2 py-4 space-y-1">
                    {navigation.map((item) => (
                        <Tooltip
                            content={item.name}
                            key={item.name}
                            className="hidden md:flex"
                        >
                            <Link
                                href={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                    item.current
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 ${
                                        item.current
                                            ? "text-blue-600"
                                            : "text-gray-400"
                                    }`}
                                />
                                <h1 className="hidden md:flex">{item.name}</h1>
                            </Link>
                        </Tooltip>
                    ))}
                </nav>
            </div>
        </div>
    );
}
