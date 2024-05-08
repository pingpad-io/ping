"use client";
import { EditIcon, LinkIcon, MoreHorizontalIcon, ReplyIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { SignedIn } from "../Authenticated";
import { Button } from "../ui/button";
import { Post } from "./Post";

export const PostMenu = ({ post }: { post: Post }) => {
  const [open, setOpen] = useState(false);

  return (
    <SignedIn>
      <Button
        type="button"
        size="icon"
        className="w-6 h-4"
        variant="ghost"
        // onClick={() => setOpen(!open)
        onClick={() => {}}
      >
        <MoreHorizontalIcon className="w-4 h-4" strokeWidth={1} />
      </Button>
      {open && <PostMenuContent post={post} profileId="" />}
    </SignedIn>
  );
};

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
      <Button size="context" variant="ghost" onClick={() => router.push(`/p/${post.id}`)}>
        <ReplyIcon size={14} className="mr-2 h-4 w-4" />
        reply
      </Button>
      <Button size="context" variant="ghost" onClick={copyLink}>
        <LinkIcon size={14} className="mr-2 h-4 w-4" />
        copy link
      </Button>
      {profileId === author.id && (
        <>
          <Button size="context" variant="ghost" onClick={setEditingQuery}>
            <EditIcon size={14} className="mr-2 h-4 w-4" />
            edit post
          </Button>

          <Button
            size="context"
            variant="ghost"
            onClick={() => {
              deletePost();
            }}
          >
            <TrashIcon size={14} className="mr-2 h-4 w-4" />
            delete post
          </Button>
        </>
      )}
    </>
  );
};
