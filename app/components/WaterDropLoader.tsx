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
                {/* Gradient Definition for the Stroke */}
                <defs>
                    <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop
                            offset="0%"
                            style={{ stopColor: "#60A5FA", stopOpacity: 1 }}
                        />
                        <stop
                            offset="100%"
                            style={{ stopColor: "#3B82F6", stopOpacity: 1 }}
                        />
                    </linearGradient>
                    <filter
                        id="glow"
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                    >
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Main Droplet Shape */}
                <motion.path
                    d="M50,15 C50,15 15,50 15,70 C15,87.5 30.5,95 50,95 C69.5,95 85,87.5 85,70 C85,50 50,15 50,15 Z"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    initial="hidden"
                    animate={isAnimating ? "visible" : "hidden"}
                    variants={pathVariants}
                    custom={0}
                />

                {/* Inner Spiral Detail */}
                <motion.path
                    d="M50,40 C45,45 40,55 40,65 C40,75 45,80 50,80 C55,80 60,75 60,65 C60,55 55,45 50,40"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    initial="hidden"
                    animate={isAnimating ? "visible" : "hidden"}
                    variants={pathVariants}
                    custom={1}
                />

                {/* Top Droplet Detail */}
                <motion.path
                    d="M50,22 C47,25 45,28 45,31 C45,34 47,36 50,36 C53,36 55,34 55,31 C55,28 53,25 50,22"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    initial="hidden"
                    animate={isAnimating ? "visible" : "hidden"}
                    variants={pathVariants}
                    custom={2}
                />

                {/* Strong Animated Glow */}
                <motion.circle
                    cx="50"
                    cy="50"
                    r="48"
                    stroke="none"
                    fill="url(#gradient)"
                    filter="url(#glow)"
                    initial={{ opacity: 0.2, r: 45 }}
                    animate={{
                        opacity: isAnimating ? 0.6 : 0.2,
                        r: isAnimating ? 50 : 45,
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />
            </svg>
        </div>
    );
};

export default WaterDropletLoader;
