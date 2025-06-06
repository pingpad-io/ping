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
    <div className="flex flex-col w-full gap-0.5 glass-post rounded-lg">
      <div className="flex flex-row p-2 sm:p-4 gap-4">
        {avatar}
        <div className="h-12 w-full grow">{content}</div>
      </div>
    </div>
  );
};
