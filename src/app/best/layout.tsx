import type { PropsWithChildren } from "react";
import { FeedLayout } from "~/components/layout/FeedLayout";

export default function layout({children}: PropsWithChildren) {
  return <FeedLayout>{children}</FeedLayout>;
}
