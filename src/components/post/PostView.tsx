"use client";

import { useRef, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { UserAvatar } from "../user/UserAvatar";
import type { Post } from "./Post";
import { PostBadges } from "./PostBadges";
import { PostContent } from "./PostContent";
import { PostContextMenu } from "./PostContextMenu";
import { PostInfo } from "./PostInfo";
import { ReplyInfo } from "./PostReplyInfo";

export const PostView = ({ post, showBadges = true }: { post: Post; showBadges?: boolean }) => {
  const [collapsed, setCollapsed] = useState(true);
  const postContentRef = useRef<HTMLDivElement>(null);

  return (
    <PostContextMenu post={post}>
      <Card onClick={() => setCollapsed(false)}>
        <CardContent className="flex h-fit flex-row gap-4 p-2 sm:p-4">
          <div className="w-10 h-10 shrink-0 grow-0 rounded-full">
            <UserAvatar user={post.author} />
          </div>
          <div className="flex w-3/4 shrink group max-w-2xl grow flex-col place-content-start">
            <ReplyInfo post={post} />
            <PostInfo post={post} />
            <PostContent ref={postContentRef} post={post} collapsed={collapsed} setCollapsed={setCollapsed} />
            {showBadges && <PostBadges post={post} />}
          </div>
        </CardContent>
      </Card>
    </PostContextMenu>
  );
};
