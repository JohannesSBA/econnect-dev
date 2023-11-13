import { motion, useScroll, useSpring } from "framer-motion";

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        className="fixed rounded-3xl left-0 bottom-0 top-0 w-2 h-full bg-blue-800 ml-2"
        style={{ scaleY }}
      />
    </>
  );
}
