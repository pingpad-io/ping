import { Card } from "../ui/card";

export const PostSuspense = () => {
  const avatar = (
    <div className="flex h-full items-center justify-center">
      <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
    </div>
  );
  const content = (
    <div className="flex h-full flex-col items-start justify-center gap-2">
      <div className="h-3 w-1/2 animate-pulse rounded-full bg-muted" />
      <div className="my-2 h-4 w-full animate-pulse rounded-full bg-muted" />
    </div>
  );

  return (
    <Card className="flex h-fit flex-row gap-4 p-2 sm:p-4 glass-post">
      {avatar}
      <div className="h-12 w-full grow">{content}</div>
    </Card>
  );
};
