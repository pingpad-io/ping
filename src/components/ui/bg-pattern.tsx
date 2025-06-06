import { cn } from "@/src/utils";
import React from "react";

type BGVariantType = "dots" | "diagonal-stripes" | "grid" | "horizontal-lines" | "vertical-lines" | "checkerboard";
type BGMaskType =
  | "fade-center"
  | "fade-edges"
  | "fade-edges-bottom"
  | "fade-top"
  | "fade-bottom"
  | "fade-left"
  | "fade-right"
  | "fade-x"
  | "fade-y"
  | "none";

type BGPatternProps = React.ComponentProps<"div"> & {
  variant?: BGVariantType;
  mask?: BGMaskType;
  size?: number;
  fill?: string;
};

const maskClasses: Record<BGMaskType, string> = {
  "fade-edges": "[mask-image:radial-gradient(ellipse_at_center,hsl(var(--background)),transparent)]",
  "fade-edges-bottom":
    "[mask-image:radial-gradient(ellipse_60%_100%_at_50%_0%,hsl(var(--background))_0%,hsl(var(--background))_30%,transparent_70%)]",
  "fade-center": "[mask-image:radial-gradient(ellipse_at_center,transparent,hsl(var(--background)))]",
  "fade-top": "[mask-image:linear-gradient(to_bottom,transparent,hsl(var(--background)))]",
  "fade-bottom": "[mask-image:linear-gradient(to_bottom,hsl(var(--background)),transparent)]",
  "fade-left": "[mask-image:linear-gradient(to_right,transparent,hsl(var(--background)))]",
  "fade-right": "[mask-image:linear-gradient(to_right,hsl(var(--background)),transparent)]",
  "fade-x": "[mask-image:linear-gradient(to_right,transparent,hsl(var(--background)),transparent)]",
  "fade-y": "[mask-image:linear-gradient(to_bottom,transparent,hsl(var(--background)),transparent)]",
  none: "",
};

function getBgImage(variant: BGVariantType, fill: string, size: number) {
  // Convert theme color names to CSS custom properties
  const colorValue =
    fill.startsWith("#") || fill.startsWith("rgb") || fill.startsWith("hsl") ? fill : `hsl(var(--${fill}))`;

  switch (variant) {
    case "dots":
      return `radial-gradient(${colorValue} 1px, transparent 1px)`;
    case "grid":
      return `linear-gradient(to right, ${colorValue} 1px, transparent 1px), linear-gradient(to bottom, ${colorValue} 1px, transparent 1px)`;
    case "diagonal-stripes":
      return `repeating-linear-gradient(45deg, ${colorValue}, ${colorValue} 1px, transparent 1px, transparent ${size}px)`;
    case "horizontal-lines":
      return `linear-gradient(to bottom, ${colorValue} 1px, transparent 1px)`;
    case "vertical-lines":
      return `linear-gradient(to right, ${colorValue} 1px, transparent 1px)`;
    case "checkerboard":
      return `linear-gradient(45deg, ${colorValue} 25%, transparent 25%), linear-gradient(-45deg, ${colorValue} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${colorValue} 75%), linear-gradient(-45deg, transparent 75%, ${colorValue} 75%)`;
    default:
      return undefined;
  }
}

const BGPattern = ({
  variant = "grid",
  mask = "none",
  size = 24,
  fill = "#252525",
  className,
  style,
  ...props
}: BGPatternProps) => {
  const bgSize = `${size}px ${size}px`;
  const backgroundImage = getBgImage(variant, fill, size);

  return (
    <div
      className={cn("absolute inset-0", maskClasses[mask], className)}
      style={{
        backgroundImage,
        backgroundSize: bgSize,
        zIndex: 0,
        ...style,
      }}
      {...props}
    />
  );
};

BGPattern.displayName = "BGPattern";
export { BGPattern };
