import { BookmarkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useUserActions } from "~/hooks/useUserActions";
import { getBaseUrl } from "~/utils/getBaseUrl";
import type { Post } from "../components/post/Post";
import type { MenuContext, MenuItem } from "../components/post/PostMenuConfig";
import { useUser } from "../components/user/UserContext";

export const usePostState = (post: Post, onReply?: () => void, onMenuAction?: () => void) => {
  const router = useRouter();
  const author = post.author;
  const { user } = useUser();
  const {
    muteUser: muteUserAction,
    unmuteUser: unmuteUserAction,
    blockUser: blockUserAction,
    unblockUser: unblockUserAction,
  } = useUserActions(author, onMenuAction);
  const [isSaved, setIsSaved] = useState(post.reactions?.isBookmarked || false);
  const [isMuted, setIsMuted] = useState(post.author.actions?.muted || false);
  const [isBlocked, setIsBlocked] = useState(post.author.actions?.blocked || false);

  const baseUrl = getBaseUrl();
  const postLink = `${baseUrl}p/${post.id}`;
  const shareLink = postLink;

  const setEditingQuery = () => {
    toast.error("Not implemented yet");
    onMenuAction?.();
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
    onMenuAction?.();
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
    onMenuAction?.();
  };

  const handleReply = () => {
    onReply?.();
    onMenuAction?.();
  };

  const handleExpand = () => {
    router.push(`/p/${post.id}`);
    onMenuAction?.();
  };

  const muteUser = async () => {
    setIsMuted(true);
    await muteUserAction();
  };

  const unmuteUser = async () => {
    setIsMuted(false);
    await unmuteUserAction();
  };

  const blockUser = async () => {
    setIsBlocked(true);
    await blockUserAction();
  };

  const unblockUser = async () => {
    setIsBlocked(false);
    await unblockUserAction();
  };

  const savePost = async () => {
    // Optimistically update the state
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);

    // Show toast with bookmark icon
    toast(newSavedState ? "Post saved" : "Post unsaved", {
      icon: <BookmarkIcon size={16} fill={newSavedState ? "currentColor" : "none"} />,
    });

    try {
      const response = await fetch(`/api/posts/${post.id}/bookmark`, {
        method: "POST",
      });
      const result = await response.json();

      // If the request failed, revert the optimistic update
      if (result.result === undefined) {
        setIsSaved(!newSavedState);
        toast.error("Failed to save post");
      }
    } catch (error) {
      // Revert on error
      setIsSaved(!newSavedState);
      toast.error("Failed to save post");
    }

    onMenuAction?.();
  };

  const context: MenuContext = {
    post,
    user,
    isMuted,
    isBlocked,
    isSaved,
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
    savePost,
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
      case "save":
        return { ...baseProps, onClick: savePost };
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

  return {
    context,
    shouldShowItem,
    getItemProps,
    postLink,
    isSaved,
  };
};
