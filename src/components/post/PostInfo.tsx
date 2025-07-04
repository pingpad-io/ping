import { EllipsisIcon } from "lucide-react";
import { useState } from "react";
import Link from "~/components/Link";
import { useAuth } from "~/hooks/useAuth";
import { TimeElapsedSince } from "../TimeLabel";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import type { Post } from "./Post";
import { menuItems } from "./PostMenuConfig";
import { usePostStateWithFallback } from "./PostStateContext";

export const PostInfo = ({ post, onReply }: { post: Post; onReply?: () => void }) => {
  const [open, setOpen] = useState(false);
  const { requireAuth } = useAuth();
  const { shouldShowItem, getItemProps, postLink, isSaved } = usePostStateWithFallback(post, onReply, () =>
    setOpen(false),
  );
  const author = post.author;
  const handle = author.handle;
  const tags = post?.metadata?.tags || [];

  let community = null;
  tags.map((tag: string) => {
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

  return (
    <div
      suppressHydrationWarning
      className="group flex h-5 flex-row items-center place-items-center gap-2 text-xs font-light leading-4 text-base-content sm:text-sm"
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
      <span className="text-muted-foreground">
        <TimeElapsedSince date={post.createdAt} />
      </span>
      <div className="ml-auto">
        <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="link"
              className="flex gap-4 w-4 rounded-full hover-expand justify-center [&>span]:hover:scale-110 [&>span]:active:scale-95"
            >
              <span className="transition-transform">
                <EllipsisIcon
                  size={18}
                  strokeWidth={2.2}
                  stroke="hsl(var(--muted-foreground))"
                  className="transition-all duration-200"
                />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-max">
            {menuItems.map((item) => {
              if (!shouldShowItem(item)) return null;

              const itemProps = getItemProps(item);
              const Icon = itemProps.icon;

              if (item.id === "open-new-tab") {
                return (
                  <DropdownMenuItem key={item.id} asChild>
                    <Link
                      href={postLink}
                      referrerPolicy="no-referrer"
                      target="_blank"
                      className="flex items-center gap-3"
                    >
                      <Icon size={16} />
                      {itemProps.label}
                    </Link>
                  </DropdownMenuItem>
                );
              }

              return (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => {
                    if (item.requiresAuth) {
                      requireAuth(itemProps.onClick);
                    } else {
                      itemProps.onClick?.();
                    }
                  }}
                  disabled={itemProps.disabled}
                  className="flex items-center gap-3"
                >
                  <Icon size={16} fill={item.id === "save" && isSaved ? "currentColor" : "none"} />
                  {itemProps.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
