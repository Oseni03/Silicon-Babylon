"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps extends HTMLMotionProps<"section"> {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
}

export default function AnimatedSection({
  children,
  delay = 0,
  direction = "up",
  distance = 20,
  className,
  ...props
}: AnimatedSectionProps) {
  const getInitialOffset = () => {
    switch (direction) {
      case "up":
        return { y: distance };
      case "down":
        return { y: -distance };
      case "left":
        return { x: distance };
      case "right":
        return { x: -distance };
      default:
        return {};
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, ...getInitialOffset() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}
