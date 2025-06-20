import { useState } from "react";
import Link from "~/components/Link";
import { TimeElapsedSince } from "../TimeLabel";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import type { Post } from "./Post";
import { PostMenu } from "./PostMenu";

export const PostInfo = ({ post, onReply }: { post: Post; onReply?: () => void }) => {
  const [open, setOpen] = useState(false);
  const author = post.author;
  const isGlobalHandle = author.namespace === undefined;
  const handle = author.handle;
  const tags = post?.metadata?.tags || [];

  let community = null;
  tags.map((tag) => {
    if (tag.includes("orbcommunities")) {
      community = tag.replace("orbcommunities", "");
    }
    if (tag.includes("channel")) {
      community = tag.split("-")[1];
    }
    if (tag.includes("community")) {
      community = tag.split("-")[1];
    }
  });

  const handleMenuAction = () => {
    setOpen(false);
  };

  return (
    <div
      suppressHydrationWarning
      className="group flex flex-row items-center place-items-center gap-2 text-xs font-light leading-4 text-base-content sm:text-sm"
    >
      <Link className="flex gap-2" href={`/u/${handle}`}>
        <span className="w-fit truncate font-bold">{author.name}</span>
        <span className="text-muted-foreground">{`${isGlobalHandle ? "@" : "#"}${handle}`}</span>
      </Link>
      {community && (
        <>
          <span>{"·"}</span>
          <Link href={`/c/${community}`}>/{community}</Link>
        </>
      )}
      <span>{"·"}</span>
      <TimeElapsedSince date={post.createdAt} />
      <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-xs font-light leading-4 text-base-content sm:text-sm h-6">
            {"···"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col w-max gap-1 p-1 hover:bg-card rounded-lg border">
          <PostMenu post={post} onReply={onReply} onMenuAction={handleMenuAction} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
