import { useEffect, useState } from "react";
import type { Post } from "~/components/post/Post";
import { fetchParentPost } from "~/utils/postThreadApi";

export function useParentThread(post: Post) {
  const [parentThread, setParentThread] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadParentThread(current: Post | undefined): Promise<void> {
      if (!current) {
        setLoading(false);
        return;
      }

      const parentId = current.commentOn?.id ?? current.quoteOn?.id;
      if (!parentId) {
        setLoading(false);
        return;
      }

      const parent = await fetchParentPost(parentId);
      if (parent && !cancelled) {
        setParentThread((prev) => [parent, ...prev]);
        await loadParentThread(parent);
      } else {
        setLoading(false);
      }
    }

    loadParentThread(post);

    return () => {
      cancelled = true;
    };
  }, [post.id]);

  return { parentThread, loading };
}