"use client";

import Link from "~/components/Link";
import { Card } from "../ui/card";
import { type Community, getCommunityIcon } from "./Community";

export const CommunityView = ({ item }: { item: Community }) => {
  const icon = getCommunityIcon(item.id);
  return (
    <Link href={`/c/${item.id}`}>
      <Card className="p-1">
        <div className="flex flex-row items-center gap-2">
          <div className="flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              {/* {item.avatar && <img src={item.avatar} alt={item.name} />} */}
              {icon}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-semibold">{item.name}</span>
            <span className="text-muted">{item.description}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
