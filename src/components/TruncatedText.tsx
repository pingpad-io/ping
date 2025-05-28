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

  return (
    <span
      className={`${isTruncated ? "line-clamp-3" : "line-clamp-none"} ${className}`}
      onKeyDown={() => setIsCollapsed(!isCollapsed)}
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      {isMarkdown ? <Markdown content={truncatedText + ellipsis} /> : truncatedText + ellipsis}
    </span>
  );
};
