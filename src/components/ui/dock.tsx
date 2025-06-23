import { LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/src/utils";

interface DockProps {
  className?: string;
  items: {
    icon?: LucideIcon;
    customIcon?: React.ReactNode;
    label: string;
    onClick?: () => void;
    customComponent?: React.ReactNode;
    extra?: React.ReactNode;
    variant?: "default" | "secondary" | "primary";
  }[];
}

interface DockIconButtonProps {
  icon?: LucideIcon;
  customIcon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
  customComponent?: React.ReactNode;
  extra?: React.ReactNode;
  variant?: "default" | "secondary" | "primary";
  onHover?: () => void;
  onLeave?: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

const DockIconButton = React.forwardRef<HTMLButtonElement, DockIconButtonProps>(
  (
    {
      icon: Icon,
      customIcon,
      label,
      onClick,
      className,
      customComponent,
      extra,
      variant = "default",
      onHover,
      onLeave,
      buttonRef,
    },
    ref,
  ) => {
    if (customComponent) {
      return <div className="w-full">{customComponent}</div>;
    }

    const variantClasses = {
      default: "hover:bg-secondary",
      secondary: "bg-secondary hover:bg-primary hover:text-primary-foreground",
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    };

    return (
      <motion.button
        ref={buttonRef || ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        className={cn(
          "relative group p-3 rounded-lg w-12 h-12 flex items-center justify-center",
          "transition-colors",
          variantClasses[variant],
          className,
        )}
      >
        {customIcon ? (
          <div className="w-5 h-5 flex items-center justify-center">{customIcon}</div>
        ) : Icon ? (
          <Icon className="w-5 h-5" />
        ) : null}
      </motion.button>
    );
  },
);
DockIconButton.displayName = "DockIconButton";

const Dock = React.forwardRef<HTMLDivElement, DockProps>(({ items, className }, ref) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showExtra, setShowExtra] = useState(false);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [extraPosition, setExtraPosition] = useState<any>({ top: 0, left: 0 });
  const hideTimeoutRef = useRef<NodeJS.Timeout>();
  const dockRef = useRef<HTMLDivElement>(null);

  // Initialize refs immediately with the current items length
  const buttonRefs = useRef<React.RefObject<HTMLButtonElement>[]>(
    items.map(() => React.createRef<HTMLButtonElement>()),
  );

  // Update refs when items change
  React.useEffect(() => {
    if (buttonRefs.current.length !== items.length) {
      buttonRefs.current = items.map(() => React.createRef<HTMLButtonElement>());
    }
  }, [items.length]);

  const handleMouseEnter = useCallback(
    (index: number) => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      setPreviousIndex(hoveredIndex);
      setHoveredIndex(index);
      setShowExtra(true);
    },
    [hoveredIndex, items],
  );

  const handleMouseLeave = useCallback(() => {
    hideTimeoutRef.current = setTimeout(() => {
      setShowExtra(false);
      setHoveredIndex(null);
      setPreviousIndex(null);
    }, 200); // 0.2s delay
  }, []);

  const handleExtraMouseEnter = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  }, []);

  const handleExtraMouseLeave = useCallback(() => {
    hideTimeoutRef.current = setTimeout(() => {
      setShowExtra(false);
      setHoveredIndex(null);
      setPreviousIndex(null);
    }, 200);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const calculateExtraPosition = useCallback(() => {
    if (hoveredIndex === null || !buttonRefs.current[hoveredIndex]?.current || !dockRef.current) {
      return { top: 0, left: 0 };
    }

    const button = buttonRefs.current[hoveredIndex].current!;
    const dock = dockRef.current;

    const buttonRect = button.getBoundingClientRect();
    const dockRect = dock.getBoundingClientRect();

    const buttonTop = buttonRect.top - dockRect.top;
    const buttonLeft = buttonRect.left - dockRect.left;
    const buttonCenterY = buttonTop + buttonRect.height / 2;
    const buttonCenterX = buttonLeft + buttonRect.width / 2;

    if (window.innerWidth >= 640) {
      return {
        top: buttonCenterY - 18,
        right: dockRect.width - buttonLeft + 12,
      };
    }
    return {
      bottom: dockRect.height - buttonTop + 12,
      left: buttonCenterX - buttonRect.width,
    };
  }, [hoveredIndex]);

  // Update position when hoveredIndex changes or on initial show
  useEffect(() => {
    if (showExtra && hoveredIndex !== null) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        setExtraPosition(calculateExtraPosition());
      });
    }
  }, [showExtra, hoveredIndex, calculateExtraPosition]);

  const hoveredItem = hoveredIndex !== null ? items[hoveredIndex] : null;

  // Calculate content animation direction
  const getContentAnimationY = () => {
    if (previousIndex === null || hoveredIndex === null) return 0;

    // If transitioning down (higher index), animate content up (negative Y)
    // If transitioning up (lower index), animate content down (positive Y)
    const direction = hoveredIndex > previousIndex ? -10 : 10;
    return direction;
  };

  return (
    <div ref={ref} className={cn("flex items-center justify-center relative", className)}>
      <AnimatePresence>
        {showExtra && hoveredItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            layout
            onMouseEnter={handleExtraMouseEnter}
            onMouseLeave={handleExtraMouseLeave}
            className={cn("absolute z-50 pointer-events-auto", "shadow-lg rounded-xl", "glass glass-dim")}
            style={{
              ...extraPosition,
              transformOrigin: window.innerWidth >= 640 ? "right center" : "center bottom",
              transform: window.innerWidth >= 640 ? "translateY(-50%)" : undefined,
            }}
          >
            <motion.div
              key={hoveredIndex} // Key to trigger re-render on index change
              initial={{ y: getContentAnimationY(), opacity: 0.7 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {hoveredItem.extra ? (
                <div className="w-auto">{hoveredItem.extra}</div>
              ) : (
                <div className="px-3 py-2 text-sm font-medium text-foreground whitespace-nowrap">
                  {hoveredItem.label}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={dockRef}
        className={cn(
          "flex items-center gap-2 p-2 rounded-2xl w-full",
          "flex-row justify-around sm:flex-col sm:justify-center sm:w-auto",
          "shadow-lg",
          "glass",
        )}
      >
        {items.map((item, index) => (
          <DockIconButton
            key={item.label}
            {...item}
            buttonRef={buttonRefs.current[index]}
            onHover={() => handleMouseEnter(index)}
            onLeave={handleMouseLeave}
          />
        ))}
      </div>
    </div>
  );
});
Dock.displayName = "Dock";

export { Dock };
