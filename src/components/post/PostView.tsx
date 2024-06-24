"use client";

import { useRef, useState } from "react";
import { Card, CardContent } from "../ui/card";
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
  isLastComment?: boolean;
};

export const PostView = ({
  post,
  settings = { isComment: false, showBadges: true },
}: { post: Post; settings?: PostViewSettings }) => {
  const content = "content" in post.metadata ? post.metadata.content : "";
  const [collapsed, setCollapsed] = useState(content.length > 400);
  const postContentRef = useRef<HTMLDivElement>(null);

  return (
    <li className={"flex flex-col gap-2 w-full"}>
      <PostContextMenu post={post}>
        <Card onClick={() => setCollapsed(false)}>
          <CardContent className={`flex flex-row p-2 ${settings.isComment ? "sm:p-2 sm:pb-4 gap-2" : "sm:p-4 gap-4 "}`}>
            <span className="min-h-full flex flex-col justify-start items-center relative">
              <div className={`shrink-0 grow-0 rounded-full" ${settings.isComment ? "w-6 h-6" : "w-10 h-10"}`}>
                <UserAvatar user={post.author} />
              </div>
              {settings.isComment && (
                <div
                  className={`-mt-4 -mr-6 w-full h-[90%] border-l ${settings.isLastComment && "rounded-full h-[98%]"} ${settings.isComment && !settings.isLastComment && "min-h-[130%]"} `}
                />
              )}
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
    </li>
  );
};
