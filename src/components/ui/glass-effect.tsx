"use client";

import { motion } from "motion/react";
import * as React from "react";

interface GlassEffectProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
  children: React.ReactNode;
  className?: string;
  borderRadius?: number;
}

export const GlassEffect = React.forwardRef<HTMLDivElement, GlassEffectProps>(
  ({ children, className = "", borderRadius = 8, ...motionProps }, ref) => {
    const maskId = React.useId();

    return (
      <motion.div ref={ref} className={`relative overflow-hidden ${className}`} {...motionProps}>
        <div
          className="absolute inset-0 h-[150%] w-[150%] -inset-[25%] backdrop-blur-[16px] bg-background/40"
          style={{
            maskImage: `url(#${maskId})`,
            WebkitMaskImage: `url(#${maskId})`,
            maskSize: "cover",
            WebkitMaskSize: "cover",
          }}
        />
        <svg className="absolute inset-0" style={{ pointerEvents: "none" }} width="100%" height="100%">
          <defs>
            <mask id={maskId}>
              <rect width="150%" height="150%" fill="white" rx={borderRadius} ry={borderRadius} />
            </mask>
          </defs>
        </svg>
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  },
);

GlassEffect.displayName = "GlassEffect";
