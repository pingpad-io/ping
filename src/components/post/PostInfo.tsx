import { EllipsisIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "~/components/Link";
import { TimeElapsedSince } from "../TimeLabel";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useUserActions } from "~/hooks/useUserActions";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { Button } from "../ui/button";
import { useUser } from "../user/UserContext";
import type { Post } from "./Post";
import { menuItems, type MenuItem, type MenuContext } from "./PostMenu";

export const PostInfo = ({ post, onReply }: { post: Post; onReply?: () => void }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const author = post.author;
  const { user } = useUser();
  const { muteUser, unmuteUser, blockUser, unblockUser } = useUserActions(author, () => setOpen(false));
  const isGlobalHandle = author.namespace === undefined;
  const handle = author.handle;
  const tags = post?.metadata?.tags || [];

  const baseUrl = getBaseUrl();
  const postLink = `${baseUrl}p/${post.id}`;
  const shareLink = postLink;
  const isMuted = post.author.actions.muted;
  const isBlocked = post.author.actions.blocked;

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

  const setEditingQuery = () => {
    toast.error("Not implemented yet");
    handleMenuAction();
  };

  const deletePost = async () => {
    const result = await fetch(`/api/posts?id=${post.id}`, {
      method: "DELETE",
    });
    const data = await result.json();

    if (result.ok) {
      toast.success("Post deleted successfully!");
    } else {
      toast.error(`${data.error}`);
    }
    handleMenuAction();
  };

  const share = () => {
    navigator.clipboard.writeText(shareLink).then(
      () => {
        toast.success("Copied link to clipboard");
      },
      () => {
        toast.error("Error copying link to clipboard!");
      },
    );
    handleMenuAction();
  };

  const handleReply = () => {
    onReply?.();
    handleMenuAction();
  };

  const handleExpand = () => {
    router.push(`/p/${post.id}`);
    handleMenuAction();
  };

  const context: MenuContext = {
    post,
    user,
    isMuted,
    isBlocked,
    share,
    handleReply,
    handleExpand,
    deletePost,
    setEditingQuery,
    muteUser,
    unmuteUser,
    blockUser,
    unblockUser,
    postLink,
  };

  const shouldShowItem = (item: MenuItem) => {
    switch (item.condition) {
      case "always":
        return true;
      case "isAuthor":
        return user?.id === author.id;
      case "notAuthor":
        return user?.id !== author.id;
      case "hasReply":
        return !!onReply;
      default:
        return true;
    }
  };

  const getItemProps = (item: MenuItem) => {
    const baseProps = {
      label: item.label,
      icon: item.icon,
      onClick: item.onClick,
      disabled: item.disabled,
      variant: item.variant,
    };

    if (item.getDynamicProps) {
      return { ...baseProps, ...item.getDynamicProps(context) };
    }

    switch (item.id) {
      case "share":
        return { ...baseProps, onClick: share };
      case "reply":
        return { ...baseProps, onClick: handleReply };
      case "expand":
        return { ...baseProps, onClick: handleExpand };
      case "open-new-tab":
        return { ...baseProps, href: postLink };
      case "edit-post":
        return { ...baseProps, onClick: setEditingQuery };
      case "delete-post":
        return { ...baseProps, onClick: deletePost };
      default:
        return baseProps;
    }
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
            <Button
              variant="link"
              className="flex mr-3 gap-4 w-4 rounded-full hover-expand justify-center"
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
                    <Link href={postLink} referrerPolicy="no-referrer" target="_blank" className="flex items-center gap-3">
                      <Icon size={16} />
                      {itemProps.label}
                    </Link>
                  </DropdownMenuItem>
                );
              }

              return (
                <DropdownMenuItem
                  key={item.id}
                  onClick={itemProps.onClick}
                  disabled={itemProps.disabled}
                  className="flex items-center gap-3"
                >
                  <Icon size={16} />
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
