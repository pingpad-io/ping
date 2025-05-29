export default function loading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-muted" />
          <div className="h-6 w-24 rounded bg-muted" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded bg-muted" />
          <div className="h-8 w-16 rounded bg-muted" />
        </div>
      </div>
      <div className="grid grow grid-cols-1 items-center gap-6 py-10 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-3/4 rounded bg-muted" />
          <div className="h-8 w-2/3 rounded bg-muted" />
          <div className="h-8 w-1/2 rounded bg-muted" />
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="h-8 w-16 rounded bg-muted" />
          <div className="h-8 w-24 rounded bg-muted" />
        </div>
      </div>
      <div className="my-20 flex flex-col items-center justify-center gap-8 md:flex-row">
        <div className="h-10 w-32 rounded-full bg-muted" />
        <div className="h-10 w-24 rounded-full bg-muted" />
        <div className="h-10 w-20 rounded-full bg-muted" />
      </div>
    </div>
  );
}
