"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

export const PageTransition = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
