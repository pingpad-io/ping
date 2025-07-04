"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDeletedPosts } from "../DeletedPostsContext";
import { DissolveFilter } from "../DissolveFilter";
import { useFilteredUsers } from "../FilteredUsersContext";
import { Card, CardContent } from "../ui/card";
import { UserAvatar } from "../user/UserAvatar";
import type { Post } from "./Post";
import { PostComments } from "./PostComments";
import { PostContent } from "./PostContent";
import { PostContextMenu } from "./PostContextMenu";
import { PostInfo } from "./PostInfo";
import { PostOptimisticView } from "./PostOptimisticView";
import { ReactionsList } from "./PostReactions";
import { PostReplyComposer } from "./PostReplyComposer";
import { ReplyInfo } from "./PostReplyInfo";
import { RepostInfo } from "./PostRepostInfo";
import { PostStateProvider } from "./PostStateContext";

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
  defaultExpanded = false,
  defaultCommentsOpen = false,
}: {
  item: Post;
  settings?: PostViewSettings;
  defaultReplyOpen?: boolean;
  defaultExpanded?: boolean;
  defaultCommentsOpen?: boolean;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const content = "content" in item.metadata ? (item.metadata.content as string) : "";
  const [collapsed, setCollapsed] = useState(defaultExpanded ? false : content.length > 400);
  const [isCommentsOpen, setCommentsOpen] = useState(defaultCommentsOpen);
  const [isReplyWizardOpen, setReplyWizardOpen] = useState(defaultReplyOpen);
  const [comments, setComments] = useState(item.comments);
  const [isDissolving, setIsDissolving] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);
  const postContentRef = useRef<HTMLDivElement>(null);
  const { mutedUsers, blockedUsers } = useFilteredUsers();
  const { deletedPosts } = useDeletedPosts();

  const dissolveFilterId = useMemo(() => `dissolve-${item.id}-${Date.now()}`, [item.id]);
  const isMuted = item.author.actions?.muted;
  const isBlocked = item.author.actions?.blocked;
  const isOnUserProfile = pathname?.startsWith(`/u/${item.author.handle}`);
  const isJustMuted = mutedUsers.has(item.author.id);
  const isJustBlocked = blockedUsers.has(item.author.id);
  const isJustDeleted = deletedPosts.has(item.id);

  useEffect(() => {
    if ((isJustMuted || isJustBlocked) && !isOnUserProfile) {
      setIsDissolving(true);
      const timer = setTimeout(() => {
        setShouldHide(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isJustMuted, isJustBlocked, isOnUserProfile]);

  useEffect(() => {
    if (isJustDeleted) {
      setIsDissolving(true);
      const timer = setTimeout(() => {
        setShouldHide(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isJustDeleted]);

  if (((isMuted || isBlocked) && !isOnUserProfile) || shouldHide) {
    return null;
  }

  const handleReply = () => {
    setReplyWizardOpen(true);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      return;
    }

    const target = e.target as HTMLElement;
    const interactiveSelectors = [
      "button",
      "a",
      "input",
      "textarea",
      "select",
      '[role="button"]',
      '[role="link"]',
      '[role="menuitem"]',
      "[data-radix-collection-item]",
      "img",
      "video",
      "audio",
      "picture",
      "svg",
      "path",
      "iframe",
      "embed",
      "object",
    ];

    const isInteractive = interactiveSelectors.some((selector) => target.matches(selector) || target.closest(selector));

    if (isInteractive) {
      return;
    }

    if (collapsed) {
      setCollapsed(false);
      return;
    }

    if (pathname === `/p/${item.id}`) {
      return;
    }

    router.push(`/p/${item.id}`);
  };

  const handleCardHover = () => {
    if (pathname !== `/p/${item.id}`) {
      router.prefetch(`/p/${item.id}`);
    }
  };

  // If it's an optimistic post, show skeleton
  if ((item as any).isOptimistic) {
    return <PostOptimisticView author={item.author} isComment={settings.isComment} />;
  }

  return (
    <>
      {isDissolving && <DissolveFilter filterId={dissolveFilterId} />}
      <div
        className={`flex flex-col w-full gap-1 ${isDissolving ? "dissolving" : ""}`}
        style={{
          filter: isDissolving ? `url(#${dissolveFilterId})` : "none",
          opacity: isDissolving ? 0 : 1,
          maxHeight: isDissolving ? "0px" : "9999px",
          transition: "opacity 1s ease-out, max-height 1.0s ease-out",
          marginBottom: isDissolving ? "0" : undefined,
        }}
      >
        <PostStateProvider post={item} onReply={handleReply}>
          <PostContextMenu post={item} onReply={handleReply}>
            <Card
              className="duration-300 transition-all z-20 cursor-pointer hover:bg-muted/10"
              style={{ userSelect: "text" } as React.CSSProperties}
              onClick={handleCardClick}
              onMouseEnter={handleCardHover}
            >
              <CardContent className={`flex flex-row p-4 ${settings.isComment ? "gap-2" : "gap-4 "}`}>
                <span className="min-h-full flex flex-col justify-start items-center relative">
                  <div className={`shrink-0 z-20 grow-0 rounded-full ${settings.isComment ? "w-6 h-6" : "w-10 h-10"}`}>
                    <UserAvatar user={item.author} />
                  </div>
                </span>
                <div className="flex w-3/4 shrink group max-w-2xl grow flex-col place-content-start">
                  {!settings.isComment && !settings.inThread && <RepostInfo post={item} />}
                  {!settings.isComment && !settings.inThread && !item.quoteOn && !item.isRepost && (
                    <ReplyInfo post={item} />
                  )}
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
        </PostStateProvider>
        {isReplyWizardOpen && (
          <PostReplyComposer
            level={settings.level || 1}
            isOpen={isReplyWizardOpen}
            post={item}
            setOpen={setReplyWizardOpen}
            onCommentAdded={(comment) => {
              if (comment) {
                if ((comment as any).isOptimistic) {
                  setComments((prev) => [comment, ...prev]);
                  setCommentsOpen(true);
                } else {
                  setComments((prev) =>
                    prev.map(c => c.id.startsWith('optimistic') && comment.metadata?.content === c.metadata?.content ? comment : c)
                  );
                }
              }
            }}
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
