"use client";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/src/utils";
import { GlassEffect } from "./glass-effect";

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, children, ...props }, ref) => (
  <HoverCardPrimitive.Portal>
    <AnimatePresence>
      <HoverCardPrimitive.Content asChild ref={ref} align={align} sideOffset={sideOffset} {...props}>
        <GlassEffect
          className={cn(
            "z-[70] w-64 rounded-2xl border text-popover-foreground shadow-md overflow-hidden",
            className,
          )}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          transition={{
            duration: 0.15,
            scale: { type: "spring", damping: 25, stiffness: 400 },
          }}
        >
          <motion.div
            className="p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {children}
          </motion.div>
        </GlassEffect>
      </HoverCardPrimitive.Content>
    </AnimatePresence>
  </HoverCardPrimitive.Portal>
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };
