import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default function loading() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 p-2 sm:p-4 md:p-20 animate-pulse">
      <div className="h-10 w-1/2 rounded bg-muted" />
      <div className="h-6 w-2/3 rounded bg-muted" />
      <div className="flex flex-col gap-8 p-2 md:p-8">
        {[1, 2, 3].map((n) => (
          <Card key={`card-${n}`}>
            <CardHeader>
              <div className="h-6 w-16 rounded bg-muted" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mx-auto my-10 w-full max-w-3xl p-4">
        <CardHeader>
          <div className="h-6 w-16 rounded bg-muted" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-11/12 rounded bg-muted" />
          <div className="h-4 w-3/4 rounded bg-muted" />
        </CardContent>
      </Card>
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
        {[1, 2, 3].map((n) => (
          <div key={`btn-${n}`} className="h-10 w-24 rounded-full bg-muted" />
        ))}
      </div>
    </div>
  );
}
