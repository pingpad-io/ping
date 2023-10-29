import { useUser } from "@supabase/auth-helpers-react";
import { Post } from "~/server/api/routers/posts";
import { api } from "~/utils/api";
import { ReactionBadge } from "./Reactions";

export function ReactionsList({ post }: { post: Post }) {
  const user = useUser();
  let { data: reactions } = api.reactions.get.useQuery({});

  if (!reactions || !user) return null;

  reactions = reactions.filter((reaction) => !post.reactions.find((existing) => existing.reactionId === reaction.id));

  return (
    <>
      {reactions.map((reaction) => (
        <ReactionBadge key={post.id + reaction.id} reaction={reaction} post={post} />
      ))}
    </>
  );
}
