import { motion } from "framer-motion";

export default function App() {
    return (
        <motion.div
            className="w-72 h-72 bg-transparent border-2 border-black dark:border-white"
            animate={{
                scale: [0.7, 1.2, 1.2, 0.7, 0.7],
                rotate: [0, 0, 180, 180, 0],
                borderRadius: ["10%", "10%", "50%", "50%", "10%"],
            }}
            transition={{
                duration: 4,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 3,
            }}
        />
    );
}
