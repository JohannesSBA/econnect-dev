"use client";

import React, { useState } from "react";
import {
    Button,
    Pagination,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
} from "@nextui-org/react";
import { User } from "@/app/types/db";
import axios from "axios";
import { useRouter } from "next/navigation";
import ProfileImage from "./ProfileImage";
import AccountPreferences from "../../dashboard/settings/SideBarComponents/AccountPreferences";
import { motion } from "framer-motion";

interface StarterProps {
    user: User;
}

const StarterForms = ({ user }: StarterProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();

    const totalPages = 2;

    async function finish() {
        try {
            await axios.post("/api/user/started", { id: user.id });
            setTimeout(() => {
                router.push("/dashboard");
            }, 5000);
        } catch (error) {
            console.error("Error finishing setup:", error);
            // Handle error (e.g., show error message to user)
        }
    }

    const renderPageContent = () => {
        switch (currentPage) {
            case 1:
                return (
                    <div className="w-full max-w-md flex flex-col gap-8 items-center shadow-sm">
                        <h2 className="text-2xl font-semibold text-blue-700">
                            Profile Picture
                        </h2>
                        <ProfileImage id={user.id} />
                    </div>
                );
            case 2:
                return (
                    <div className="w-full h-full translate-y-32">
                        <h2 className="text-2xl font-semibold text-blue-700 mb-4">
                            Account Preferences
                        </h2>
                        <AccountPreferences user={user as any} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white to-blue-300 flex justify-center items-center p-4">
            <Card className="w-full max-w-4xl bg-white/80 backdrop-blur-md shadow-xl">
                <CardHeader className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-blue-700">
                        Welcome to Econnect
                    </h1>
                    <p className="text-gray-600">
                        Personalize your profile to stand out to employers
                    </p>
                </CardHeader>
                <CardBody>
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                Hello, {user.firstName}
                            </h2>
                            <p className="text-gray-600">
                                Complete these steps to set up your profile and
                                get started with Econnect.
                            </p>
                        </div>
                        <div className="md:w-2/3">
                            <motion.div
                                key={currentPage}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderPageContent()}
                            </motion.div>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="flex flex-col items-center gap-4">
                    <Pagination
                        total={totalPages}
                        initialPage={1}
                        page={currentPage}
                        onChange={setCurrentPage}
                        color="primary"
                    />
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            onPress={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            isDisabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        {currentPage !== totalPages ? (
                            <Button
                                size="sm"
                                variant="flat"
                                color="primary"
                                onPress={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                    )
                                }
                            >
                                Next
                            </Button>
                        ) : (
                            <Button size="sm" color="primary" onClick={finish}>
                                Finish
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default StarterForms;
