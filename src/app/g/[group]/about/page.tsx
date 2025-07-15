"use client";

import { Card, CardContent } from "~/components/ui/card";
import { useGroup } from "~/hooks/useGroup";
import { FeedSuspense } from "~/components/FeedSuspense";
import { GroupHeader } from "~/components/groups/GroupHeader";
import { GroupNavigation } from "~/components/groups/GroupNavigation";

interface GroupAboutPageProps {
  params: {
    group: string;
  };
}

export default function GroupAboutPage({ params }: GroupAboutPageProps) {
  const { data: group, isLoading, error } = useGroup(params.group);

  if (isLoading) {
    return (
      <div className="z-[30] p-4 py-0">
        <div className="pt-4">
          <FeedSuspense />
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="z-[30] p-4 py-0">
        <div className="pt-4">
          <div className="text-center text-muted-foreground">Group not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="z-[30] p-4 py-0">
      <div className="pt-4">
        <GroupHeader group={group} />
        <GroupNavigation groupAddress={params.group} />

        <Card className="glass">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>

            {group.metadata?.description && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p className="text-base">{group.metadata.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {group.address && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Group Address</h3>
                  <p className="text-sm font-mono break-all">{group.address}</p>
                </div>
              )}

              {group.timestamp && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Created</h3>
                  <p className="text-sm">{new Date(group.timestamp).toLocaleDateString()}</p>
                </div>
              )}

              {group.owner && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Owner</h3>
                  <p className="text-sm font-mono break-all">{group.owner}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}