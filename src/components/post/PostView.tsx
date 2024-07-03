"use client";

import { useRef, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { UserAvatar } from "../user/UserAvatar";
import type { Post } from "./Post";
import { PostComments } from "./PostComments";
import { PostContent } from "./PostContent";
import { ContextMenu } from "./PostContextMenu";
import { PostInfo } from "./PostInfo";
import { PostMenu } from "./PostMenu";
import { ReactionsList } from "./PostReactions";
import { ReplyInfo } from "./PostReplyInfo";

type PostViewSettings = {
  showBadges?: boolean;
  isComment?: boolean;
  isLastComment?: boolean;
};

export const PostView = ({
  item,
  settings = { isComment: false, showBadges: true },
}: { item: Post; settings?: PostViewSettings }) => {
  const content = "content" in item.metadata ? item.metadata.content : "";
  const [collapsed, setCollapsed] = useState(content.length > 400);
  const [isCommentsOpen, setCommentsOpen] = useState({ click: false, hover: false });
  const postContentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={"flex flex-col gap-2 w-full"}>
      <ContextMenu post={item}>
        <Card onClick={() => setCollapsed(false)}>
          <CardContent className={`flex flex-row p-2 ${settings.isComment ? "sm:p-2 sm:pb-4 gap-2" : "sm:p-4 gap-4 "}`}>
            <span className="min-h-full flex flex-col justify-start items-center relative">
              <div className={`shrink-0 grow-0 rounded-full" ${settings.isComment ? "w-6 h-6" : "w-10 h-10"}`}>
                <UserAvatar user={item.author} />
              </div>
              {settings.isComment && (
                <div
                  className={`-mt-4 -mr-6 w-full h-[90%] border-l ${settings.isLastComment && "rounded-full h-[98%]"} ${settings.isComment && !settings.isLastComment && "min-h-[130%]"} `}
                />
              )}
            </span>
            <div className="flex w-3/4 shrink group max-w-2xl grow flex-col place-content-start">
              {!settings.isComment && <ReplyInfo post={item} />}
              <PostInfo post={item} />
              <PostContent ref={postContentRef} post={item} collapsed={collapsed} setCollapsed={setCollapsed} />
              {settings?.showBadges && (
                <ReactionsList
                  collapsed={collapsed}
                  isCommentsOpen={isCommentsOpen}
                  setCommentsOpen={setCommentsOpen}
                  post={item}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </ContextMenu>
      <PostComments isOpen={isCommentsOpen} post={item} />
    </div>
  );
};
