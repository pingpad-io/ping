"use client";
import { EditIcon, ExternalLinkIcon, LinkIcon, ReplyIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import type { Post } from "./Post";

export const PostMenuContent = ({ post, profileId }: { post: Post; profileId: string }) => {
  const router = useRouter();
  const author = post.author;

  const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";
  const postLink = `${origin}/p/${post.id}`;

  const setEditingQuery = () => {
    toast.error("Not implemented yet");
  };

  const deletePost = () => {
    toast.error("Not implemented yet");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(postLink).then(
      () => {
        toast.success("Copied link to clipboard");
      },
      () => {
        toast.error("Error copying link to clipboard!");
      },
    );
  };

  return (
    <>
      <Link href={postLink} referrerPolicy="no-referrer" target="_blank">
        <Button size="context" variant="ghost" onClick={() => router.push(`/p/${post.id}`)}>
          <ExternalLinkIcon size={12} className="mr-2 h-4 w-4" />
          open
        </Button>
      </Link>
      <Button size="context" variant="ghost" onClick={() => router.push(`/p/${post.id}`)}>
        <ReplyIcon size={12} className="mr-2 h-4 w-4" />
        reply
      </Button>
      <Button size="context" variant="ghost" onClick={copyLink}>
        <LinkIcon size={12} className="mr-2 h-4 w-4" />
        copy link
      </Button>
      {profileId === author.id && (
        <>
          <Button size="context" variant="ghost" onClick={setEditingQuery}>
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
