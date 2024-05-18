"use client";

import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const message = error.message.slice(0, 200);

  return (
    <div className="max-w-screen-xl px-4 py-16">
      <div className="max-w-screen-sm text-center">
        <h2 className="text-2xl font-bold">Σ(O_O) Something went wrong</h2>

        {message && <p className="text-base mx-auto text-muted-foreground p-4 w-[50%]">{message}</p>}
        <Link href={"/home"}>
          <Button size="sm" type="button" variant="secondary">
            <ChevronLeftIcon size={20} />
            Go home
          </Button>
        </Link>
      </div>
    </div>
  );
}
