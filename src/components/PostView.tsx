import { useUser } from "@clerk/nextjs";
import { Post } from "@prisma/client";

import Image from "next/image";
import Link from "next/link";
import { BsCircleFill } from "react-icons/bs";
import { api } from "~/utils/api";
import TimeSinceLabel from "./TimeSinceLabel";

export const PostView = ({ post }: { post: Post }) => {
  const { user } = useUser();

  let author = api.profile.getUserById.useQuery({ userId: post.authorId });
  let username = author.data?.username;
  let postId = "#" + post.id.substring(post.id.length - 8).toLowerCase();

  let avatar = author.isLoading ? (
    <>
      <BsCircleFill className="avatar h-12 w-12 animate-pulse rounded-full fill-base-300" />
    </>
  ) : (
    <>
      <Link className="" href={`/${username}`}>
        <Image
          className="avatar rounded-full"
          src={author.data?.profileImageUrl ?? ""}
          alt={`${author.data?.username}'s profile image`}
          width={48}
          height={48}
        />
      </Link>
    </>
  );

  let metadata = author.isLoading ? (
    <div className="mb-2 h-3 w-64 rounded-full bg-base-200"></div>
  ) : (
    <div className="flex flex-row gap-2 text-sm text-base-content">
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
  );

  return (
    <div className="my-1 flex flex-row gap-4 rounded-xl border border-base-300 p-4">
      <div className="h-12 w-12 shrink-0 grow-0">{avatar}</div>

      <div>
        {metadata}
        <Link className="" href={`/post/${post.id}`}>
          <div className="text-lg text-base-content">{post.content}</div>
        </Link>
      </div>
    </div>
  );
};
