"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

type DeletedPostsContextType = {
  deletedPosts: Set<string>;
  addDeletedPost: (postId: string) => void;
  removeDeletedPost: (postId: string) => void;
};

const DeletedPostsContext = createContext<DeletedPostsContextType | undefined>(undefined);

export const DeletedPostsProvider = ({ children }: { children: ReactNode }) => {
  const [deletedPosts, setDeletedPosts] = useState<Set<string>>(new Set());

  const addDeletedPost = (postId: string) => {
    setDeletedPosts((prev) => new Set(prev).add(postId));
  };

  const removeDeletedPost = (postId: string) => {
    setDeletedPosts((prev) => {
      const next = new Set(prev);
      next.delete(postId);
      return next;
    });
  };

  return (
    <DeletedPostsContext.Provider value={{ deletedPosts, addDeletedPost, removeDeletedPost }}>
      {children}
    </DeletedPostsContext.Provider>
  );
};

export const useDeletedPosts = () => {
  const context = useContext(DeletedPostsContext);
  if (!context) {
    throw new Error("useDeletedPosts must be used within a DeletedPostsProvider");
  }
  return context;
};