"use client";

import type { Group } from "@lens-protocol/client";
import { Users } from "lucide-react";
import Link from "~/components/Link";
import { Card, CardContent } from "../ui/card";

interface GroupViewProps {
  item: Group;
}

export function GroupView({ item }: GroupViewProps) {
  const groupUrl = `/g/${item.address}`;

  return (
    <Link href={groupUrl} className="block">
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {item.metadata?.icon ? (
                <img
                  src={item.metadata.icon}
                  alt={item.metadata?.name || item.address}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">
                {item.metadata?.name || `Group ${item.address.slice(0, 6)}...${item.address.slice(-4)}`}
              </h3>

              {item.metadata?.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.metadata.description}</p>
              )}

              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Members
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
