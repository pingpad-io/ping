"use client";
import { useState } from "react";
import Markdown from "./Markdown";

export const TruncatedText = ({
  text,
  maxLength,
  isMarkdown = true,
  className,
}: {
  text: string;
  maxLength: number;
  isMarkdown?: boolean;
  className?: string;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  if (!text) return null;
  const isTruncated = isCollapsed && text.length > maxLength;
  const truncatedText = isCollapsed ? text.substring(0, maxLength) : text;
  const ellipsis = isTruncated ? "..." : "";

  // Extract color-related classes to pass to Markdown component
  const colorClasses =
    className
      ?.split(" ")
      .filter((cls) => cls.includes("text-") || cls.includes("prose-"))
      .join(" ") || "";

  // Generate prose link classes to match text color
  const generateProseClasses = (colorClasses: string) => {
    if (!colorClasses) return "";

    // Extract the main color from text- classes
    const textColorMatch = colorClasses.match(/text-([^\s]+)/);
    if (textColorMatch) {
      const colorName = textColorMatch[1];
      return `prose-a:text-${colorName} prose-a:no-underline hover:prose-a:underline`;
    }
    return "";
  };

  const proseClasses = generateProseClasses(colorClasses);
  const allColorClasses = `${colorClasses} ${proseClasses}`.trim();

  // Non-color classes for the span wrapper
  const wrapperClasses =
    className
      ?.split(" ")
      .filter((cls) => !cls.includes("text-") && !cls.includes("prose-"))
      .join(" ") || "";

  return (
    <span
      className={`${isTruncated ? "line-clamp-3" : "line-clamp-none"} ${wrapperClasses}`}
      onKeyDown={() => setIsCollapsed(!isCollapsed)}
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      {isMarkdown ? (
        <Markdown content={truncatedText + ellipsis} className={allColorClasses} />
      ) : (
        <span className={allColorClasses}>{truncatedText + ellipsis}</span>
      )}
    </span>
  );
};
