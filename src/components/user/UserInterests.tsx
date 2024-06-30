"use client";

import { ProfileInterestTypes } from "@lens-protocol/react-web";
import { useMemo } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Toggle } from "../ui/toggle";
import { type UserInterests, capitalize, parseInterests } from "./User";

export const InterestsList = ({ activeInterests }: { activeInterests: UserInterests[] }) => {
  const userInterests = activeInterests.map((interest) => interest.value);

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
    if (!result.ok) {
      toast.error(result.statusText);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(groupedInterests).map(([category, items]) => {
        const categoryTitle = category.split("_")[0];

        return (
          <div key={category}>
            <h1 className="text-lg font-bold">{capitalize(categoryTitle.replace(/_/g, " "))}</h1>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <Toggle
                  size="sm"
                  key={item.value}
                  defaultPressed={userInterests.includes(item.value)}
                  onClick={() => handleClick(item.value)}
                >
                  {item.label}
                </Toggle>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const UserInterestsList = ({ interests }: { interests: UserInterests[] }) => {
  const groupedInterests = useMemo(() => {
    return interests.reduce(
      (acc, interest) => {
        acc[interest.category] = acc[interest.category] || [];
        acc[interest.category].push(interest);
        return acc;
      },
      {} as Record<string, UserInterests[]>,
    );
  }, []);

  return (
    <div className="flex flex-wrap gap-4">
      {Object.entries(groupedInterests).map(([category, items]) => {
        return (
          <div key={category}>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <Label key={item.value}>{item.label}</Label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
