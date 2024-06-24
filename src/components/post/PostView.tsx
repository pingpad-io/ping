"use client";

import { useRef, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { UserAvatar } from "../user/UserAvatar";
import type { Post } from "./Post";
import { PostComments } from "./PostComments";
import { PostContent } from "./PostContent";
import { PostContextMenu } from "./PostContextMenu";
import { PostInfo } from "./PostInfo";
import { ReactionsList } from "./PostReactions";
import { ReplyInfo } from "./PostReplyInfo";

type PostViewSettings = {
  showBadges?: boolean;
  isComment?: boolean;
};

export const PostView = ({
  post,
  settings = { isComment: false, showBadges: true },
}: { post: Post; settings?: PostViewSettings }) => {
  const content = "content" in post.metadata ? post.metadata.content : "";
  const [collapsed, setCollapsed] = useState(content.length > 400);
  const postContentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={"flex flex-col gap-2 w-full"}>
      <PostContextMenu post={post}>
        <Card onClick={() => setCollapsed(false)}>
          <CardContent className="flex flex-row gap-4 p-2 sm:p-4">
            <span className="min-h-full flex flex-col justify-start items-center relative">
              {/* {settings.isComment && (
                <Separator orientation="vertical" className="h-[150%] absolute border-text-foreground left-5 -top-4" />
              )} */}
              <div className="w-10 h-10 shrink-0 grow-0 rounded-full">
                <UserAvatar user={post.author} />
              </div>
            </span>
            <div className="flex w-3/4 shrink group max-w-2xl grow flex-col place-content-start">
              <ReplyInfo post={post} />
              <PostInfo post={post} />
              <PostContent ref={postContentRef} post={post} collapsed={collapsed} setCollapsed={setCollapsed} />
              {settings?.showBadges && <ReactionsList collapsed={collapsed} post={post} />}
            </div>
          </CardContent>
        </Card>
      </PostContextMenu>
      <PostComments post={post} />
    </div>
  );
};
