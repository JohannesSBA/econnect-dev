"use client";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";
import { Badge } from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GiWaterDrop } from "react-icons/gi";
import { IoBriefcase, IoChatbox, IoHome, IoLink } from "react-icons/io5";
import SignOutButton from "../functionComponents/SignOutButton";
import { useUser } from "../functionComponents/UserContext";
import Search from "../SearchComponents/Search";
import Link from "next/link";
import { FaBars, FaBell, FaTimes } from "react-icons/fa";

interface appProps {
    userInfoId: string;
    userName: string;
    userEmail: string;
}
export default function App({ userInfoId, userName, userEmail }: appProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [messageCounter, setMessageCounter] = useState(0); // New state for unread message count
    const [notificationCounter, setNotificationCounter] = useState(0); // New state for unread notification count

    const menuItems = [
        ["Profile", "/dashboard/profile"],
        ["Dashboard", "/dashboard"],
        ["Messages", "/chat"],
        ["Connections", "/dashboard/connections"],
        ["Search", "/search"],
        ["My Settings", "/dashboard/settings"],
        ["Help & Feedback", "/help"],
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
        <Disclosure as="nav" className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button */}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <FaBars
                                aria-hidden="true"
                                className="block h-6 w-6 group-data-[open]:hidden"
                            />
                            <FaTimes
                                aria-hidden="true"
                                className="hidden h-6 w-6 group-data-[open]:block"
                            />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <div className="h-8 w-autho flex items-center md:-translate-x-10 text-blue-800">
                                <GiWaterDrop />
                                <p className="flex font-bold text-inherit">
                                    Econnect
                                </p>
                            </div>
                            <div className="h-8 w-auto"> </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                            <a
                                href="/dashboard"
                                className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900 flex-col justify-center gap-2"
                            >
                                <IoHome />
                                Dashboard
                            </a>
                            <a
                                href="/chat"
                                className="inline-flex items-center border-b-2   px-1 pt-1 text-sm font-medium text-gray-900 flex-col justify-center gap-2"
                            >
                                <Badge
                                    content={messageCounter} // Show unread messages count
                                    color="primary"
                                    shape="circle"
                                    size="sm"
                                    isInvisible={messageCounter === 0}
                                    // hidden={messageCounter == 0} // Hide badge when there are no unread messages
                                    className="border-none"
                                >
                                    <IoChatbox />
                                </Badge>
                                <h1 className="hidden md:flex text-xs">
                                    Messaging
                                </h1>
                            </a>
                            <a
                                href="/listings"
                                className="inline-flex items-center border-b-2   px-1 pt-1 text-sm font-medium text-gray-900 flex-col justify-center gap-2"
                            >
                                <IoBriefcase />
                                Listing
                            </a>
                            <a
                                href="/dashboard/connections"
                                className="inline-flex items-center border-b-2   px-1 pt-1 text-sm font-medium text-gray-900 flex-col justify-center gap-2"
                            >
                                <IoLink />
                                Connects
                            </a>
                            <div className="inline-flex items-center border-b-2   px-1 pt-1 text-sm font-medium text-gray-900 flex-col justify-center gap-2">
                                <Search />
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <Link
                            type="button"
                            href="/dashboard/notifications"
                            className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">View notifications</span>
                            <Badge
                                content={notificationCounter} // Show unread messages count
                                color="primary"
                                shape="circle"
                                size="sm"
                                isInvisible={notificationCounter === 0}
                                // hidden={messageCounter == 0} // Hide badge when there are no unread messages
                                className="border-none"
                            >
                                <FaBell
                                    aria-hidden="true"
                                    className="h-6 w-6"
                                />
                            </Badge>
                        </Link>

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <MenuButton className="relative flex rounded-full bg-white text-sm focus:outline-none gap-2 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">
                                        Open user menu
                                    </span>
                                    <Image
                                        alt=""
                                        src={`https://econnectbucket.s3.amazonaws.com/image/${userInfoId}`}
                                        width={8}
                                        height={8}
                                        className="h-8 w-8 rounded-full border-2 border-slate-400"
                                    />
                                    <div className="flex flex-col text-start text-xs font-light">
                                        <p className="text-blue-800">
                                            {userName}
                                        </p>
                                        <p>{userEmail}</p>
                                    </div>
                                </MenuButton>
                            </div>
                            <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                            >
                                <MenuItem>
                                    <a
                                        href="/dashboard/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                    >
                                        Profile
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                    >
                                        Messaging
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                    >
                                        Listings
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                    >
                                        Connects
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <div className="flex w-full h-full justify-center">
                                        <SignOutButton />
                                    </div>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 pb-4 pt-2">
                    {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
                    <DisclosureButton
                        as="a"
                        href="#"
                        className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
                    >
                        Dashboard
                    </DisclosureButton>
                    <DisclosureButton
                        as="a"
                        href="#"
                        className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                    >
                        Team
                    </DisclosureButton>
                    <DisclosureButton
                        as="a"
                        href="#"
                        className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                    >
                        Projects
                    </DisclosureButton>
                    <DisclosureButton
                        as="a"
                        href="#"
                        className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                    >
                        Calendar
                    </DisclosureButton>
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}
