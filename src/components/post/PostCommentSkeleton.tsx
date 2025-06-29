export const CommentSkeleton = ({ isLastComment = false }: { isLastComment?: boolean }) => {
  return (
    <div
      className="rounded-lg text-card-foreground border-0 ease-in-out shadow-none glass z-20 cursor-pointer hover:bg-muted/10"
    >

      <div className="flex flex-row p-4 gap-2">
        <span className="min-h-full flex flex-col justify-start items-center relative">
          <div className="shrink-0 grow-0 rounded-full w-6 h-6 bg-background/20 animate-pulse" />
        </span>
        <div className="flex w-3/4 shrink group max-w-2xl grow flex-col place-content-start gap-2.5">
          <div className="flex mt-1 flex-row items-center gap-2">
            <div className="h-4 w-16 bg-background/40 rounded animate-pulse" />
            <div className="h-4 w-8 bg-background/40 rounded animate-pulse" />
          </div>

          <div className="space-y-2 mt-3">
            <div className="h-4 w-full bg-background/40 rounded animate-pulse" />
            <div className="h-4 mt-3 w-3/4 bg-background/40 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
