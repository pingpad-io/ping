"use client";

import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";
import { toast } from "sonner";
import Link from "~/components/Link";
import { useUserActions } from "~/hooks/useUserActions";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { ContextMenu as Context, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";
import { useUser } from "../user/UserContext";
import type { Post } from "./Post";
import { menuItems, type MenuItem, type MenuContext } from "./PostMenu";

export const PostContextMenu = (props: PropsWithChildren & { post: Post; onReply?: () => void }) => {
  const router = useRouter();
  const author = props.post.author;
  const { user } = useUser();
  const { muteUser, unmuteUser, blockUser, unblockUser } = useUserActions(author);

  const baseUrl = getBaseUrl();
  const postLink = `${baseUrl}p/${props.post.id}`;
  const shareLink = postLink;
  const isMuted = props.post.author.actions.muted;
  const isBlocked = props.post.author.actions.blocked;

  const setEditingQuery = () => {
    toast.error("Not implemented yet");
  };

  const deletePost = async () => {
    const result = await fetch(`/api/posts?id=${props.post.id}`, {
      method: "DELETE",
    });
    const data = await result.json();

    if (result.ok) {
      toast.success("Post deleted successfully!");
    } else {
      toast.error(`${data.error}`);
    }
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
  };

  const handleReply = () => {
    props.onReply?.();
  };

  const handleExpand = () => {
    router.push(`/p/${props.post.id}`);
  };

  const context: MenuContext = {
    post: props.post,
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
        return !!props.onReply;
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
    <Context>
      <ContextMenuContent
        onContextMenu={(e) => {
          e.stopPropagation();
        }}
        className="w-max"
      >
        {menuItems.map((item) => {
          if (!shouldShowItem(item)) return null;

          const itemProps = getItemProps(item);
          const Icon = itemProps.icon;

          if (item.id === "open-new-tab") {
            return (
              <ContextMenuItem key={item.id} asChild>
                <Link href={postLink} referrerPolicy="no-referrer" target="_blank" className="flex items-center gap-3">
                  <Icon size={12} className="h-4 w-4" />
                  {itemProps.label}
                </Link>
              </ContextMenuItem>
            );
          }

          return (
            <ContextMenuItem
              key={item.id}
              onClick={itemProps.onClick}
              disabled={itemProps.disabled}
              className="flex items-center gap-3"
            >
              <Icon size={12} className="h-4 w-4" />
              {itemProps.label}
            </ContextMenuItem>
          );
        })}
      </ContextMenuContent>
      <ContextMenuTrigger>{props.children}</ContextMenuTrigger>
    </Context>
  );
};
