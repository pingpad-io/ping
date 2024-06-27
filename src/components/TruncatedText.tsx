"use client";
import { useState } from "react";
import Markdown from "./Markdown";

export const TruncatedText = ({
  text,
  maxLength,
  isMarkdown = true,
}: {
  text: string;
  maxLength: number;
  isMarkdown?: boolean;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const isTruncated = text.length > maxLength;
  const truncatedText = isCollapsed ? text.substring(0, maxLength) : text;
  const ellipsis = isTruncated ? "..." : "";

  return (
    <span onKeyDown={() => setIsCollapsed(!isCollapsed)} onClick={() => setIsCollapsed(!isCollapsed)}>
      {isMarkdown ? <Markdown content={truncatedText} /> : truncatedText}
      {ellipsis}
    </span>
  );
};
