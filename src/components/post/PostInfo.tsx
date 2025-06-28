import { EllipsisIcon } from "lucide-react";
import { useState } from "react";
import Link from "~/components/Link";
import { TimeElapsedSince } from "../TimeLabel";
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
        {/* <span className="w-fit truncate font-bold">{author.name}</span> */}
        <span className="font-bold w-fit">{`${handle}`}</span>
      </Link>
      {community && (
        <>
          <span>{"·"}</span>
          <Link href={`/c/${community}`}>/{community}</Link>
        </>
      )}
      <span>{"·"}</span>
      <TimeElapsedSince date={post.createdAt} />
      <div className="ml-auto">
        <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="border-0 px-0 place-content-center items-center flex 
              flex-row gap-1.5 hover:bg-transparent 
              [&>span:first-child]:hover:scale-110 [&>span:first-child]:active:scale-95 
              min-w-[3ch] transition-transform"
            >
              <span className="transition-transform">
                <EllipsisIcon
                  size={18}
                  strokeWidth={2.2}
                  stroke="hsl(var(--muted-foreground))"
                  className="transition-all duration-200"
                />
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col w-max gap-1 p-1 rounded-lg border">
            <PostMenu post={post} onReply={onReply} onMenuAction={handleMenuAction} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
