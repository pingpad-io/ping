import { useQuery } from "@tanstack/react-query";
import type { Post } from "~/components/post/Post";

export function useCachedPost(post: Post): Post {
  const { data } = useQuery({
    queryKey: ["post", post.id],
    queryFn: () => post,
    initialData: post,
    staleTime: Number.POSITIVE_INFINITY, // Don't refetch automatically
    enabled: false, // Don't fetch, just subscribe to cache
  });

  return data || post;
}
