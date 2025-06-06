"use client";

import type { PropsWithChildren } from "react";
import { useRef } from "react";
import { ContextMenu as Context, ContextMenuContent, ContextMenuTrigger } from "../ui/context-menu";
import type { Post } from "./Post";
import { PostMenu } from "./PostMenu";

export const PostContextMenu = (props: PropsWithChildren & { post: Post; onReply?: () => void }) => {
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const handleMenuAction = () => {
    if (contextMenuRef.current) {
      contextMenuRef.current.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    }
  };

  return (
    <Context modal={false}>
      <ContextMenuContent
        ref={contextMenuRef}
        onContextMenu={(e) => {
          e.stopPropagation();
        }}
        className="flex flex-col w-max gap-1 p-1 hover:bg-card rounded-lg border"
      >
        <PostMenu post={props.post} onReply={props.onReply} onMenuAction={handleMenuAction} />
      </ContextMenuContent>
      <ContextMenuTrigger>{props.children}</ContextMenuTrigger>
    </Context>
  );
};
