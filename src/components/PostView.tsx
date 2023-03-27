import { Post } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const PostView = ({ post }: { post: Post }) => {
  let date = post.createdAt.toLocaleDateString();
  let time = dayjs(post.createdAt).fromNow();
  let id = post.authorId.substring(post.authorId.length - 7);
  let user = "@" + id.toLocaleLowerCase();

  return (
    <div className="mt-2 border-b-2 border-slate-700 p-4">
      <div className="flex flex-row gap-2 text-sm">
        <div className="">{user}</div>
        <div>·</div>
        <div className="">{time}</div>
      </div>
      <div className="text-lg">{post.content}</div>
    </div>
  );
};
