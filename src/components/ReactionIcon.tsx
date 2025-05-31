import {
  ArrowBigDown,
  ArrowBigUp,
  BookmarkIcon,
  CirclePlusIcon,
  HeartIcon,
  MessageSquareIcon,
  Repeat2Icon,
} from "lucide-react";
import React, { forwardRef } from "react";
import { PostReactionType } from "./post/Post";

interface ReactionIconProps {
  reaction: PostReactionType | "Like";
  pressed?: boolean;
  variant?: "post" | "comment";
}

const ReactionIcon = forwardRef<SVGSVGElement, ReactionIconProps>(({ reaction, pressed, variant = "post" }, ref) => {
  const isPost = variant === "post";
  const baseStroke = isPost ? 2.2 : 1.8;
  const activeStroke = isPost ? 4 : 3.5;
  const iconProps = pressed
    ? {
        strokeWidth: activeStroke,
        fill: reaction === "Like" ? "#ff82a9" : "hsl(var(--primary))",
      }
    : { strokeWidth: baseStroke };
  const icons = {
    Like: <HeartIcon size={isPost ? 18 : 15} {...iconProps} ref={ref} />,
    Upvote: <ArrowBigUp size={isPost ? 24 : 20} {...iconProps} strokeWidth={isPost ? 1.8 : 1.5} ref={ref} />,
    Downvote: <ArrowBigDown size={isPost ? 24 : 20} {...iconProps} strokeWidth={isPost ? 1.8 : 1.5} ref={ref} />,
    Bookmark: <BookmarkIcon size={isPost ? 18 : 16} {...iconProps} ref={ref} />,
    Repost: (
      <Repeat2Icon size={isPost ? 20 : 18} strokeWidth={pressed ? (isPost ? 3.5 : 3) : isPost ? 2 : 1.5} ref={ref} />
    ),
    Collect: (
      <CirclePlusIcon
        size={isPost ? 18 : 16}
        strokeWidth={pressed ? (isPost ? 3.5 : 3.3) : isPost ? 2.4 : 2}
        ref={ref}
      />
    ),
    Comment: <MessageSquareIcon size={isPost ? 18 : 15} ref={ref} />,
  };

  return icons[reaction] || null;
});

export default ReactionIcon;
