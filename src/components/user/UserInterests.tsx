"use client";

import { ProfileInterestTypes } from "@lens-protocol/react-web";
import { useMemo } from "react";
import { toast } from "sonner";
import { Toggle } from "../ui/toggle";
import { type UserInterests, capitalize, parseInterests } from "./User";

export const UserInterestList = ({ interests }: { interests: UserInterests[] }) => {
  const userInterests = interests.map((interest) => interest.value);

  const groupedInterests = useMemo(() => {
    const interests = parseInterests(Object.values(ProfileInterestTypes));

    // Group interests by category
    return interests.reduce(
      (acc, interest) => {
        acc[interest.category] = acc[interest.category] || [];
        acc[interest.category].push(interest);
        return acc;
      },
      {} as Record<string, UserInterests[]>,
    );
  }, []);

  const handleClick = async (value: ProfileInterestTypes) => {
    const result = await fetch(`/api/profile/interests?interest=${value}`, {
      method: "POST",
      body: JSON.stringify({ value }),
    });
    const data = await result.json();
    if (!data.ok) {
      toast.error(data.message);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {Object.entries(groupedInterests).map(([category, items]) => (
        <div key={category}>
          <h4>{capitalize(category.replace(/_/g, " "))}</h4>
          <div>
            {items.map((item) => (
              <Toggle
                key={item.value}
                defaultPressed={userInterests.includes(item.value)}
                onClick={() => handleClick(item.value)}
              >
                {item.label}
              </Toggle>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
