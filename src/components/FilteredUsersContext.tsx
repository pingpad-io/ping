"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type FilteredUsersContextType = {
  filteredUsers: Set<string>;
  addFilteredUser: (userId: string) => void;
  removeFilteredUser: (userId: string) => void;
};

const FilteredUsersContext = createContext<FilteredUsersContextType | undefined>(undefined);

export const FilteredUsersProvider = ({ children }: { children: ReactNode }) => {
  const [filteredUsers, setFilteredUsers] = useState<Set<string>>(new Set());

  const addFilteredUser = (userId: string) => {
    setFilteredUsers((prev) => new Set(prev).add(userId));
  };

  const removeFilteredUser = (userId: string) => {
    setFilteredUsers((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  };

  return (
    <FilteredUsersContext.Provider value={{ filteredUsers, addFilteredUser, removeFilteredUser }}>
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