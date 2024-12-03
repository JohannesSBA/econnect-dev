"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const WaterDropletLoader: React.FC = () => {
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setIsAnimating((prev) => !prev);
        }, 2500); // Reset animation every 2.5 seconds

        return () => clearInterval(timer);
    }, []);

    const pathVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i: number) => ({
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: {
                    delay: i * 0.3,
                    type: "spring",
                    duration: 2,
                    bounce: 0,
                },
                opacity: { delay: i * 0.1, duration: 0.01 },
            },
        }),
    };

    return (
        <div className="flex items-center justify-center w-full h-screen ">
            <svg
                width="200"
                height="200"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Main droplet shape */}
                <motion.path
                    d="M50,15 C50,15 15,50 15,70 C15,87.5 30.5,95 50,95 C69.5,95 85,87.5 85,70 C85,50 50,15 50,15 Z"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial="hidden"
                    animate={isAnimating ? "visible" : "hidden"}
                    variants={pathVariants}
                    custom={0}
                />
                {/* Inner spiral detail */}
                <motion.path
                    d="M50,40 C45,45 40,55 40,65 C40,75 45,80 50,80 C55,80 60,75 60,65 C60,55 55,45 50,40"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial="hidden"
                    animate={isAnimating ? "visible" : "hidden"}
                    variants={pathVariants}
                    custom={1}
                />
                {/* Top droplet detail */}
                <motion.path
                    d="M47,22 C47,22 43,26 43,30 C43,34 47,36 50,36 C53,36 57,34 57,30 C57,26 53,22 53,22"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial="hidden"
                    animate={isAnimating ? "visible" : "hidden"}
                    variants={pathVariants}
                    custom={2}
                />
            </svg>
        </div>
    );
};

export default WaterDropletLoader;
