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
  const iconProps = pressed ? { strokeWidth: 3.5, fill: "hsl(var(--primary))" } : { strokeWidth: 1.8 };
  const icons = {
    Like: <HeartIcon size={15} {...iconProps} ref={ref} />,
    Upvote: <ArrowBigUp size={20} {...iconProps} strokeWidth={1.5} ref={ref} />,
    Downvote: <ArrowBigDown size={20} {...iconProps} strokeWidth={1.5} ref={ref} />,
    Bookmark: <BookmarkIcon size={16} {...iconProps} ref={ref} />,
    Repost: <Repeat2Icon size={18} strokeWidth={pressed ? 3 : 1.5} ref={ref} />,
    Collect: <CirclePlusIcon size={16} strokeWidth={pressed ? 3.3 : 1.5} ref={ref} />,
    Comment: <MessageSquareIcon size={15} ref={ref} />,
  };

  return icons[reaction] || null;
});

export default ReactionIcon;
