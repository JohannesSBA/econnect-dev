import { FC, ReactNode, useRef } from "react";
import { delay, useInView } from "framer-motion";

interface MyProps {
  children?: ReactNode;
  delay: number;
}

export const Section: FC<MyProps> = (MyProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref}>
      <span
        style={{
          transform: isInView ? "none" : "translateX(-200px)",
          opacity: isInView ? 1 : 0,
          transition: `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ${MyProps.delay}s`,
        }}
      >
        {MyProps.children}
      </span>
    </section>
  );
};
