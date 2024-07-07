"use client";

import type { PropsWithChildren } from "react";
import { ContextMenu as Context, ContextMenuContent, ContextMenuTrigger } from "../ui/context-menu";
import type { Post } from "./Post";
import { PostMenu } from "./PostMenu";

export const PostContextMenu = (props: PropsWithChildren & { post: Post }) => {
  return (
    <Context modal={false}>
      <ContextMenuContent
        onContextMenu={(e) => {
          e.stopPropagation();
        }}
        className="flex flex-col w-max gap-1 p-1 hover:bg-card border"
      >
        <PostMenu post={props.post} />
      </ContextMenuContent>
      <ContextMenuTrigger>{props.children}</ContextMenuTrigger>
    </Context>
  );
};
