import { CardContent } from "../ui/card";

import { Card } from "../ui/card";

export const CommentSkeleton = ({ isLastComment = false }: { isLastComment?: boolean }) => {
  return (
    <Card className="min-h-[96px] glass-post">
      <CardContent className="flex flex-row p-2 sm:p-2 sm:pb-4 gap-2">
        <span className="min-h-full flex flex-col justify-start items-center relative">
          <div className="shrink-0 grow-0 rounded-full w-6 h-6 bg-muted animate-pulse" />
        </span>
        <div className="flex w-3/4 shrink group max-w-2xl grow flex-col place-content-start gap-2">
          <div className="flex flex-row items-center gap-2">
            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            <div className="h-3 w-8 bg-muted rounded animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
