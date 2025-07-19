import { Repeat2Icon } from "lucide-react";
import Link from "~/components/Link";
import type { Post } from "~/lib/types/post";
import { TimeElapsedSince } from "../TimeLabel";

export const RepostInfo = ({ post }: { post: Post }) => {
  if (!post.isRepost || !post.repostedBy) return null;

  const username = post.repostedBy.handle;

  return (
    <Link
      href={`/u/${username}`}
      className="flex flex-row items-center gap-1 -mt-2 text-xs font-light leading-3 text-muted-foreground"
    >
      <Repeat2Icon size={14} className="shrink-0 text-muted-foreground" />
      <span className="pb-0.5">
        {username} reposted {post.repostedAt && <TimeElapsedSince date={post.repostedAt} />} {" ago"}
      </span>
    </Link>
  );
};
