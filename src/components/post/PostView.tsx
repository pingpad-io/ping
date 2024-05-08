"use client";
import { Edit2Icon, ReplyIcon } from "lucide-react";
import Link from "next/link";
import { forwardRef, useRef, useState } from "react";
import Markdown from "../Markdown";
import { TimeElapsedSince } from "../TimeLabel";
import { UserAvatar } from "../UserAvatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Post } from "./Post";
import { PostContextMenu } from "./PostContextMenu";
import { PostMenu } from "./PostMenu";
import { ReactionsList } from "./PostReactions";

export const PostView = ({ post, showBadges = true }: { post: Post; showBadges?: boolean }) => {
  const [collapsed, setCollapsed] = useState(true);
  const postContentRef = useRef<HTMLDivElement>(null);

  return (
    <PostContextMenu post={post}>
      <Card onClick={() => setCollapsed(false)}>
        <CardContent className="flex h-fit flex-row gap-4 p-2 sm:p-4">
          <div className="w-10 h-10 shrink-0 grow-0 rounded-full">
            <UserAvatar user={post.author} link={false} />
          </div>
          <div className="flex w-3/4 shrink group max-w-2xl grow flex-col place-content-start">
            <ReplyInfo post={post} />
            <PostInfo post={post} />
            <PostContent ref={postContentRef} post={post} collapsed={collapsed} setCollapsed={setCollapsed} />
            {showBadges && <PostBadges post={post} />}
          </div>
        </CardContent>
      </Card>
    </PostContextMenu>
  );
};

export const PostContent = forwardRef<
  HTMLDivElement,
  { post: Post; collapsed: boolean; setCollapsed: (value: boolean) => void }
>(({ post, collapsed }, ref) => {
  // const router = useRouter();
  // const editing = router.query.editing === post.id;
  const editing = false;

  return editing ? (
    <>
      <div className="truncate whitespace-pre-wrap break-words text-sm/tight sm:text-base/tight h-auto line-clamp-none">
        {/* <PostEditor post={post} /> */}
      </div>
    </>
  ) : (
    <div
      ref={ref}
      className={`truncate whitespace-pre-wrap break-words text-sm/tight sm:text-base/tight h-auto ${
        collapsed ? "line-clamp-5" : "line-clamp-none"
      }`}
    >
      <Markdown content={post.content} />
      {/* <Metadata metadata={post.metadata} /> */}
    </div>
  );
});

export const ReplyInfo = ({ post }: { post: Post }) => {
  const username = post.reply?.author?.handle;
  const content = post.reply?.content?.substring(0, 100);
  const id = post.reply?.id;

  if (!post?.reply) return null;

  return (
    <Link href={`/p/${id ?? ""}`} className="flex flex-row items-center gap-1 -mt-2 text-xs font-light leading-3">
      <ReplyIcon size={14} className="shrink-0 scale-x-[-1] transform" />
      <span className="pb-0.5">@{username}:</span>
      <span className="truncate pb-0.5 ">{content}</span>
    </Link>
  );
};

export const PostInfo = ({ post }: { post: Post }) => {
  const author = post.author;
  const isLensHandle = author.namespace === "lens";
  const handle = author.handle;

  return (
    <div className="group flex flex-row items-center place-items-center gap-2 text-xs font-light leading-4 text-base-content sm:text-sm">
      <Link className="flex gap-2" href={`/u/${handle}`}>
        <span className="w-fit truncate font-bold">{author.name}</span>
        <span className="">{`${isLensHandle ? "@" : "#"}${handle}`}</span>
      </Link>
      <span>{"·"}</span>
      <TimeElapsedSince date={post.createdAt} />
      <PostMenu post={post} />
    </div>
  );
};

export const PostBadges = ({ post }: { post: Post }) => {
  // const editedIndicator = EditedIndicator({ post });
  const existingReactions = ReactionsList({ post });

  const hasButtons = existingReactions;

  return (
    <div className="flex grow flex-row  grow justify-around w-full items-center -mb-2 -ml-2 mt-2">
      {hasButtons && <ReactionsList post={post} />}
    </div>
  );
};

export function EditedIndicator({ post }: { post: Post }) {
  const lastUpdated = post.updatedAt ? post.updatedAt.toLocaleString() : post.createdAt.toLocaleString();
  const tooltipText = `last updated at ${lastUpdated}`;

  if (post.createdAt.toUTCString() === post.updatedAt.toUTCString()) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" className="w-10 h-6 flex flex-row gap-1 leading-3 ">
            <Edit2Icon size={14} className="shrink-0 scale-x-[-1] transform" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
