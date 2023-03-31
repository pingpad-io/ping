import { useUser } from "@clerk/nextjs";
import { Post } from "@prisma/client";

import Link from "next/link";
import { api } from "~/utils/api";
import TimeSinceLabel from "./TimeSinceLabel";

export const PostView = ({ post }: { post: Post }) => {
  const { user } = useUser();

  let author = api.profile.getUserById.useQuery({ userId: post.authorId });
  let username = author.data?.username;
  let postId = "#" + post.id.substring(post.id.length - 8).toLowerCase();

  return (
    <div className="border-b border-base-300 p-4">
      <Link className="" href={`/post/${post.id}`}>
        <div className="flex flex-row gap-2 text-sm text-neutral-content">
          {!author.isLoading && (
            <>
              <span className="">
                {`@${username}`}{" "}
                {user?.id === post.authorId && <span className="">(you)</span>}
              </span>
              {`·`}
            </>
          )}

          <TimeSinceLabel date={post.createdAt} />

          {`·`}
          <div className="">{postId}</div>
        </div>
        <div className="text-lg text-base-content">{post.content}</div>
      </Link>
    </div>
  );
};
