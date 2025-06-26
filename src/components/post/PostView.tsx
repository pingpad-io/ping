"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { DissolveFilter } from "../DissolveFilter";
import { useFilteredUsers } from "../FilteredUsersContext";
import { Card, CardContent } from "../ui/card";
import { UserAvatar } from "../user/UserAvatar";
import type { Post } from "./Post";
import { PostComments } from "./PostComments";
import { PostContent } from "./PostContent";
import { PostContextMenu } from "./PostContextMenu";
import { PostInfo } from "./PostInfo";
import { ReactionsList } from "./PostReactions";
import { PostReplyComposer } from "./PostReplyComposer";
import { ReplyInfo } from "./PostReplyInfo";
import { RepostInfo } from "./PostRepostInfo";

type PostViewSettings = {
  showBadges?: boolean;
  isComment?: boolean;
  isLastComment?: boolean;
  level?: number;
  inThread?: boolean;
};

export const PostView = ({
  item,
  settings = { isComment: false, showBadges: true, level: 1 },
  defaultReplyOpen = false,
}: {
  item: Post;
  settings?: PostViewSettings;
  defaultReplyOpen?: boolean;
}) => {
  const pathname = usePathname();
  const content = "content" in item.metadata ? (item.metadata.content as string) : "";
  const [collapsed, setCollapsed] = useState(content.length > 400);
  const [isCommentsOpen, setCommentsOpen] = useState(false);
  const [isReplyWizardOpen, setReplyWizardOpen] = useState(defaultReplyOpen);
  const [comments, setComments] = useState(item.comments);
  const [isDissolving, setIsDissolving] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);
  const postContentRef = useRef<HTMLDivElement>(null);
  const { mutedUsers, blockedUsers } = useFilteredUsers();

  // Generate a unique filter ID for this post's dissolve effect
  const dissolveFilterId = useMemo(() => `dissolve-${item.id}-${Date.now()}`, [item.id]);

  // Check if the post author is muted or blocked
  const isMuted = item.author.actions?.muted;
  const isBlocked = item.author.actions?.blocked;

  // Check if we're on the muted/blocked user's profile page
  const isOnUserProfile = pathname?.startsWith(`/u/${item.author.handle}`);

  // Check if user was just muted or blocked
  const isJustMuted = mutedUsers.has(item.author.id);
  const isJustBlocked = blockedUsers.has(item.author.id);

  useEffect(() => {
    if ((isJustMuted || isJustBlocked) && !isOnUserProfile) {
      setIsDissolving(true);
      const timer = setTimeout(() => {
        setShouldHide(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isJustMuted, isJustBlocked, isOnUserProfile]);

  // Don't show posts from muted or blocked users unless we're on their profile page
  if (((isMuted || isBlocked) && !isOnUserProfile) || shouldHide) {
    return null;
  }

  const handleReply = () => {
    setReplyWizardOpen(true);
  };

  return (
    <>
      {isDissolving && <DissolveFilter filterId={dissolveFilterId} />}
      <div
        className={`flex flex-col w-full gap-0.5 overflow-hidden ${isDissolving ? "dissolving" : ""}`}
        style={{
          filter: isDissolving ? `url(#${dissolveFilterId})` : "none",
          opacity: isDissolving ? 0 : 1,
          maxHeight: isDissolving ? "0px" : "9999px",
          transition: "opacity 1s ease-out, max-height 1.0s ease-out",
          marginBottom: isDissolving ? "0" : undefined,
        }}
      >
        <PostContextMenu post={item} onReply={handleReply}>
          <Card
            className="glass duration-300 transition-all z-20"
            onClick={() => {
              setCollapsed(false);
            }}
          >
            <CardContent
              className={`flex flex-row p-2 ${settings.isComment ? "sm:p-2 sm:pb-4 gap-2" : "sm:p-4 gap-4 "}`}
            >
              <span className="min-h-full flex flex-col justify-start items-center relative">
                <div className={`shrink-0 z-20 grow-0 rounded-full ${settings.isComment ? "w-6 h-6" : "w-10 h-10"}`}>
                  <UserAvatar user={item.author} />
                </div>
              </span>
              <div className="flex w-3/4 shrink group max-w-2xl grow flex-col place-content-start">
                {!settings.isComment && !settings.inThread && <RepostInfo post={item} />}
                {!settings.isComment && !settings.inThread && !item.quoteOn && <ReplyInfo post={item} />}
                <PostInfo post={item} onReply={handleReply} />
                <PostContent ref={postContentRef} post={item} collapsed={collapsed} setCollapsed={setCollapsed} />
                {settings?.showBadges && (
                  <ReactionsList
                    isComment={settings.isComment}
                    isCommentsOpen={isCommentsOpen}
                    setCommentsOpen={setCommentsOpen}
                    collapsed={collapsed}
                    post={item}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </PostContextMenu>
        {isReplyWizardOpen && (
          <PostReplyComposer
            level={settings.level || 1}
            isOpen={isReplyWizardOpen}
            post={item}
            setOpen={setReplyWizardOpen}
          />
        )}
        {isCommentsOpen && (
          <PostComments
            level={settings.level + 1}
            isOpen={isCommentsOpen}
            post={item}
            comments={comments}
            setComments={setComments}
          />
        )}
      </div>
    </>
  );
};
