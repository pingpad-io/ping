import Link from "next/link";
import { TimeElapsedSince } from "../TimeLabel";
import type { Post } from "./Post";

export const PostInfo = ({ post }: { post: Post }) => {
  const author = post.author;
  const isLensHandle = author.namespace === "lens";
  const handle = author.handle;
  const tags = post.metadata.tags || [];

  let communityText = null;
  let community = "";
  tags.map((tag) => {
    if (tag.includes("orbcommunities")) {
      communityText = `orb/${tag.replace("orbcommunities", "")}`;
      community = tag;
    }
    if (tag.includes("channel")) {
      communityText = `channel/${tag.split("-")[1]}`;
      community = tag;
    }
  });

  return (
    <div
      suppressHydrationWarning
      className="group flex flex-row items-center place-items-center gap-2 text-xs font-light leading-4 text-base-content sm:text-sm"
    >
      <Link className="flex gap-2" href={`/u/${handle}`}>
        <span className="w-fit truncate font-bold">{author.name}</span>
        <span className="">{`${isLensHandle ? "@" : "#"}${handle}`}</span>
      </Link>
      {communityText && (
        <>
          <span>{"·"}</span>
          <Link href={`/c/${community}`}>{communityText}</Link>
        </>
      )}
      <span>{"·"}</span>
      <TimeElapsedSince date={post.createdAt} />
    </div>
  );
};
