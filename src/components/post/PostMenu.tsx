"use client";
import { EditIcon, ExternalLinkIcon, MaximizeIcon, ReplyIcon, Share2Icon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "~/components/Link";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { Button } from "../ui/button";
import { useUser } from "../user/UserContext";
import type { Post } from "./Post";

export const PostMenu = ({
  post,
  onReply,
  onMenuAction,
}: {
  post: Post;
  onReply?: () => void;
  onMenuAction?: () => void;
}) => {
  const router = useRouter();
  const author = post.author;
  const { user } = useUser();

  const baseUrl = getBaseUrl();
  const postLink = `${baseUrl}p/${post.id}`;
  const shareLink = postLink;

  const setEditingQuery = () => {
    toast.error("Not implemented yet");
    onMenuAction?.();
  };

  const deletePost = async () => {
    // TODO: add confirmation dialog
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

  const handleOpenInNewTab = () => {
    onMenuAction?.();
  };

  return (
    <>
      {onReply && (
        <Button size="context" variant="ghost" onClick={handleReply}>
          <ReplyIcon size={12} className="mr-2 h-4 w-4" />
          reply
        </Button>
      )}
      <Button size="context" variant="ghost" onClick={handleExpand}>
        <MaximizeIcon size={12} className="mr-2 h-4 w-4" />
        expand
      </Button>
      <Link href={postLink} referrerPolicy="no-referrer" target="_blank">
        <Button size="context" variant="ghost" onClick={handleOpenInNewTab}>
          <ExternalLinkIcon size={12} className="mr-2 h-4 w-4" />
          open in new tab
        </Button>
      </Link>
      <Button size="context" variant="ghost" onClick={share}>
        <Share2Icon size={12} className="mr-2 h-4 w-4" />
        share
      </Button>
      {user?.id === author.id && (
        <>
          <Button size="context" variant="ghost" onClick={setEditingQuery} disabled>
            <EditIcon size={12} className="mr-2 h-4 w-4" />
            edit post
          </Button>

          <Button
            size="context"
            variant="ghost"
            onClick={() => {
              deletePost();
            }}
          >
            <TrashIcon size={12} className="mr-2 h-4 w-4" />
            delete post
          </Button>
        </>
      )}
    </>
  );
};
