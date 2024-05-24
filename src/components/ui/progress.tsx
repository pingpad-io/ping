import { cn } from "@/src/utils";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

interface ProgressProps {
  className?: string;
  value?: number;
  onChange?: (newValue: number) => void;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ className, value, onChange, ...props }, ref) => {
  const [indicatorPosition, setIndicatorPosition] = React.useState<number>(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const rect = (ref as React.MutableRefObject<HTMLDivElement>).current.getBoundingClientRect();
    if (!rect) return;

    const handleMouseMove = (e: MouseEvent) => {
      const offsetX = e.clientX - rect.left;
      const newValue = (offsetX / rect.width) * 100;
      onChange?.(newValue);
      setIndicatorPosition(newValue);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Immediately call handleMouseMove to update the value on initial click position
    handleMouseMove(e.nativeEvent as MouseEvent);
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      onMouseDown={handleMouseDown}
      className={cn("relative h-4 w-full transition-none rounded-full overflow-hidden bg-secondary", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary relative"
        style={{ transform: `translateX(-${100 - indicatorPosition}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
