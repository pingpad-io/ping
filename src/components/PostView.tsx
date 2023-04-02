import { useUser } from "@clerk/nextjs";
import { Post } from "@prisma/client";

import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";
import TimeSinceLabel from "./TimeSinceLabel";

export const PostView = ({ post }: { post: Post }) => {
  const { user } = useUser();

  let author = api.profile.getUserById.useQuery({ userId: post.authorId });
  let username = author.data?.username;
  let postId = "#" + post.id.substring(post.id.length - 8).toLowerCase();

  if (author.isLoading) {
    let width = post.content.length * 10;
    let widthclass = "max-w-[" + width + "px]";

    return (
      <div className="animate-pulse border-b border-base-300 p-4">
        <div className="mb-4 h-2 w-64 rounded-full bg-neutral"></div>
        <div
          className={`mb-3 h-3 rounded-full bg-neutral text-lg ${widthclass}`}
        ></div>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4 border-b border-base-300 p-4">
      <div className="h-12 w-12 shrink-0 grow-0">
        <Link className="" href={`/${username}`}>
          <Image
            className="avatar rounded-full"
            src={author.data?.profileImageUrl ?? ""}
            alt={`${author.data?.username}'s profile image`}
            width={48}
            height={48}
          />
        </Link>
      </div>
      <div>
        <div className="flex flex-row gap-2 text-sm text-neutral-content">
          <Link className="" href={`/${username}`}>
            {`@${username}`} {user?.id === post.authorId && <span>(you)</span>}
          </Link>
          {`·`}
          <TimeSinceLabel date={post.createdAt} />
          {`·`}
          <Link className="" href={`/post/${post.id}`}>
            <div className="">{postId}</div>
          </Link>
        </div>
        <Link className="" href={`/post/${post.id}`}>
          <div className="text-lg text-base-content">{post.content}</div>
        </Link>
      </div>
    </div>
  );
};
