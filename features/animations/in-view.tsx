"use client";

import React, { PropsWithChildren } from "react";
import { motion, Variants } from "framer-motion";

export type InViewProps = PropsWithChildren<{
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  className?: string;
}>;

const base: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  y = 16,
  once = true,
  className,
}: InViewProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      transition={{ delay, duration, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  delay = 0,
  duration = 0.5,
  once = true,
  className,
}: InViewProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      variants={base}
      transition={{ staggerChildren: 0.12, delayChildren: delay, duration, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
