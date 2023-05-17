import { Post } from "@prisma/client";

import Image from "next/image";
import Link from "next/link";
import { BsCircleFill } from "react-icons/bs";
import { api } from "~/utils/api";
import TimeSinceLabel from "./TimeSinceLabel";
import { PostWithUser } from "./Feed";

export const PostView = ({ post: fullPost }: { post: PostWithUser }) => {
  const author = fullPost.author;
  const post = fullPost.post;
  const username = author.username;
  const postId = "#" + post.id.substring(post.id.length - 8).toLowerCase();

  let avatar = (
    <Link className="" href={`/${username}`}>
      <Image
        className="avatar rounded-full"
        src={author.profileImageUrl ?? ""}
        alt={`${author.username}'s profile image`}
        width={48}
        height={48}
      />
    </Link>
  );

  let metadata = (
    <div className="flex flex-row gap-2 text-sm text-base-content">
      <Link className="" href={`/${username}`}>
        {`@${username}`} {user?.id === author.id && <span>(you)</span>}
      </Link>
      {`·`}
      <TimeSinceLabel date={post.createdAt} />
      {`·`}
      <Link className="" href={`/post/${post.id}`}>
        <div className="">{postId}</div>
      </Link>
    </div>
  );

  let content = (
    <Link className="" href={`/post/${post.id}`}>
      <div className="text-lg text-base-content">{post.content}</div>
    </Link>
  );

  return (
    <div className="my-1 flex flex-row gap-4 rounded-xl border border-base-300 p-4">
      <div className="h-12 w-12 shrink-0 grow-0">{avatar}</div>
      <div>
        {metadata}
        {content}
      </div>
    </div>
  );
};
