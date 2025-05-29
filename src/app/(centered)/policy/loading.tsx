export default function loading() {
  return (
    <div className="prose dark:prose-invert p-8 lg:prose-lg animate-pulse">
      <div className="space-y-4">
        <div className="h-8 w-1/4 rounded bg-muted" />
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={`p-${n}`} className="space-y-2">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
