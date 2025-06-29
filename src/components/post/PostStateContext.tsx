"use client";

import { createContext, type PropsWithChildren, useContext } from "react";
import { usePostState } from "~/hooks/usePostState";
import type { Post } from "./Post";

type PostStateContextType = ReturnType<typeof usePostState> | null;

export const PostStateContext = createContext<PostStateContextType>(null);

export const PostStateProvider = ({
  children,
  post,
  onReply,
  onMenuAction,
}: PropsWithChildren<{
  post: Post;
  onReply?: () => void;
  onMenuAction?: () => void;
}>) => {
  const postState = usePostState(post, onReply, onMenuAction);

  return <PostStateContext.Provider value={postState}>{children}</PostStateContext.Provider>;
};

export const usePostStateContext = () => {
  const context = useContext(PostStateContext);
  if (!context) {
    throw new Error("usePostStateContext must be used within a PostStateProvider");
  }
  return context;
};

// Hook that tries to use context first, falls back to creating new state
export const usePostStateWithFallback = (post: Post, onReply?: () => void, onMenuAction?: () => void) => {
  const context = useContext(PostStateContext);
  const fallbackState = usePostState(post, onReply, onMenuAction);

  // Use context if available, otherwise use fallback
  return context || fallbackState;
};
