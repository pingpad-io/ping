"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

type FilteredUsersContextType = {
  mutedUsers: Set<string>;
  blockedUsers: Set<string>;
  addMutedUser: (userId: string) => void;
  removeMutedUser: (userId: string) => void;
  addBlockedUser: (userId: string) => void;
  removeBlockedUser: (userId: string) => void;
};

const FilteredUsersContext = createContext<FilteredUsersContextType | undefined>(undefined);

export const FilteredUsersProvider = ({ children }: { children: ReactNode }) => {
  const [mutedUsers, setMutedUsers] = useState<Set<string>>(new Set());
  const [blockedUsers, setBlockedUsers] = useState<Set<string>>(new Set());

  const addMutedUser = (userId: string) => {
    setMutedUsers((prev) => new Set(prev).add(userId));
  };

  const removeMutedUser = (userId: string) => {
    setMutedUsers((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  };

  const addBlockedUser = (userId: string) => {
    setBlockedUsers((prev) => new Set(prev).add(userId));
  };

  const removeBlockedUser = (userId: string) => {
    setBlockedUsers((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  };

  return (
    <FilteredUsersContext.Provider
      value={{ mutedUsers, blockedUsers, addMutedUser, removeMutedUser, addBlockedUser, removeBlockedUser }}
    >
      {children}
    </FilteredUsersContext.Provider>
  );
};

export const useFilteredUsers = () => {
  const context = useContext(FilteredUsersContext);
  if (!context) {
    throw new Error("useFilteredUsers must be used within a FilteredUsersProvider");
  }
  return context;
};
