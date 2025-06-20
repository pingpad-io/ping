"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";
import { cn } from "@/src/utils";

interface ProgressProps {
  className?: string;
  value?: number;
  onChange?: (newValue: number) => void;
  playing?: boolean;
  setPlaying?: (playing: boolean) => void;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, onChange, playing, setPlaying, ...props }, ref) => {
    const [indicatorPosition, setIndicatorPosition] = React.useState<number>(value || 0);

    React.useEffect(() => {
      if (value !== undefined) {
        setIndicatorPosition(value);
      }
    }, [value]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();

      const wasPlaying = playing;
      setPlaying?.(false);

      const rect = (ref as React.MutableRefObject<HTMLDivElement>).current.getBoundingClientRect();
      if (!rect) return;

      const handleMouseMove = (e: MouseEvent) => {
        e.stopPropagation();
        const offsetX = e.clientX - rect.left;
        const newValue = (offsetX / rect.width) * 100;
        onChange?.(newValue);
        setIndicatorPosition(newValue);
      };

      const handleMouseUp = () => {
        setPlaying?.(wasPlaying);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      handleMouseMove(e.nativeEvent as MouseEvent);
    };

    return (
      <ProgressPrimitive.Root
        ref={ref}
        onMouseDown={handleMouseDown}
        className={cn(
          "z-[20] relative h-4 w-full transition-none rounded-full overflow-hidden bg-secondary cursor-pointer",
          className,
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className="h-full w-full flex-1 bg-primary relative"
          style={{ transform: `translateX(-${100 - indicatorPosition}%)` }}
        />
      </ProgressPrimitive.Root>
    );
  },
);

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
