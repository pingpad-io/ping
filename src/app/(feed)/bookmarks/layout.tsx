import { BookmarkIcon } from "lucide-react";
import type { PropsWithChildren } from "react";
import { Card } from "~/components/ui/card";

export default function layout({ children }: PropsWithChildren) {
  return (
    <>
      {children}
    </>
  );
}
