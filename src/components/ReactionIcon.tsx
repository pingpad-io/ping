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
}

const ReactionIcon = forwardRef<SVGSVGElement, ReactionIconProps>(({ reaction, pressed }, ref) => {
  const iconProps = pressed ? { strokeWidth: 4, fill: "hsl(var(--primary))" } : { strokeWidth: 2.2 };
  const icons = {
    Like: <HeartIcon size={18} {...iconProps} ref={ref} />,
    Upvote: <ArrowBigUp size={24} {...iconProps} strokeWidth={1.8} ref={ref} />,
    Downvote: <ArrowBigDown size={24} {...iconProps} strokeWidth={1.8} ref={ref} />,
    Bookmark: <BookmarkIcon size={18} {...iconProps} ref={ref} />,
    Repost: <Repeat2Icon size={20} strokeWidth={pressed ? 3.5 : 2} ref={ref} />,
    Collect: <CirclePlusIcon size={18} strokeWidth={pressed ? 3.5 : 2.4} ref={ref} />,
    Comment: <MessageSquareIcon size={18} ref={ref} />,
  };

  return icons[reaction] || null;
});

export default ReactionIcon;
