"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React from "react";

function getMeteorDelay(index: number, meteorCount: number) {
  return `${((index * 173 + meteorCount * 97) % 5000) / 1000}s`;
}

function getMeteorDuration(index: number, meteorCount: number) {
  return `${5 + ((index * 37 + meteorCount * 13) % 5)}s`;
}

export const Meteors = ({
  number,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const meteorCount = number ?? 20;
  const meteors = new Array(meteorCount).fill(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {meteors.map((_, idx) => {
        // Calculate position to evenly distribute meteors across container width
        const position = idx * (2000 / meteorCount) - 400; // Spread across 800px range, centered

        return (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
              "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
              className,
            )}
            style={{
              top: "-40px", // Start above the container
              left: position + "px",
              animationDelay: getMeteorDelay(idx, meteorCount),
              animationDuration: getMeteorDuration(idx, meteorCount),
            }}
          ></span>
        );
      })}
    </motion.div>
  );
};
