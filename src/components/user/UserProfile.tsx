"use client";

import { ShieldOffIcon, VolumeXIcon } from "lucide-react";
import { useState } from "react";
import { AvatarViewer } from "~/components/user/AvatarViewer";
import { useUserActions } from "~/hooks/useUserActions";
import { type User, type UserStats } from "~/lib/types/user";
import { FollowButton } from "../FollowButton";
import PostComposer from "../post/PostComposer";
import { TruncatedText } from "../TruncatedText";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog, DialogContent } from "../ui/dialog";
import { EditProfileModal } from "./EditProfileModal";
import { useUser } from "./UserContext";
import { UserFollowing } from "./UserFollowing";

const MutedBadge = ({ onUnmute }: { onUnmute: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onUnmute}
        className={`h-6 px-2 transition-all duration-200 ${isHovered ? "pr-2" : ""}`}
      >
        <VolumeXIcon size={16} className="shrink-0" />
        <span
          className={`text-xs ml-1 overflow-hidden transition-all duration-200 ${isHovered ? "max-w-[45px] opacity-100" : "max-w-0 opacity-0"}`}
        >
          Unmute
        </span>
      </Button>
    </div>
  );
};

const BlockedBadge = ({ onUnblock }: { onUnblock: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onUnblock}
        className={`h-6 px-2 transition-all duration-200 ${isHovered ? "pr-2" : ""}`}
      >
        <ShieldOffIcon size={16} className="shrink-0" />
        <span
          className={`text-xs ml-1 overflow-hidden transition-all duration-200 ${isHovered ? "max-w-[60px] opacity-100" : "max-w-0 opacity-0"}`}
        >
          Unblock
        </span>
      </Button>
    </div>
  );
};


export const UserProfile = ({ user, stats }: { user?: User; stats?: UserStats | null }) => {
  const { user: authedUser } = useUser();
  const { requireAuth } = useUser();
  const [isMentionDialogOpen, setIsMentionDialogOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const userActions = useUserActions(user || ({} as User));

  if (!user) return null;

  const { unmuteUser, unblockUser } = userActions;

  const isUserProfile = user.id === authedUser?.id;
  const isFollowingMe = user.actions.following;
  const isMuted = user.actions?.muted;
  const isBlocked = user.actions?.blocked;
  const followingCount = stats?.following ?? 0;
  const followersCount = stats?.followers ?? 0;

  return (
    <Card className="p-6 z-20 flex w-full flex-col gap-4 mt-4 rounded-xl overflow-hidden">
      <div className="flex flex-row gap-6">
        <div className="flex shrink-0 grow-0 w-12 h-12 sm:w-24 sm:h-24 self-start">
          <AvatarViewer user={user} />
        </div>

        <div className="flex flex-col gap-2 flex-grow">
          <div className="flex flex-col justify-center gap-1">
            <div className="flex items-center gap-2">
              <div className="text-xl sm:text-3xl font-bold w-fit truncate leading-none">{user.handle}</div>
              {isFollowingMe && (
                <Badge variant="secondary" className="text-xs">
                  Follows you
                </Badge>
              )}
              {isMuted && !isUserProfile && <MutedBadge onUnmute={unmuteUser} />}
              {isBlocked && !isUserProfile && <BlockedBadge onUnblock={unblockUser} />}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {user.description && (
              <div className="text-sm">
                <TruncatedText text={user.description} maxLength={300} isMarkdown={true} />
              </div>
            )}
            <div className="flex justify-start">
              <UserFollowing user={user} followingCount={followingCount} followersCount={followersCount} />
            </div>
          </div>
        </div>
      </div>

      {isUserProfile ? (
        <Button
          size="sm"
          variant="outline"
          className="w-full mt-4 bg-transparent"
          onClick={() => setIsEditProfileOpen(true)}
        >
          Edit Profile
        </Button>
      ) : (
        <div className="flex gap-2">
          <FollowButton user={user} className="flex-1" />
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              requireAuth(() => setIsMentionDialogOpen(true));
            }}
            className="flex-1 bg-transparent"
          >
            Mention
          </Button>
        </div>
      )}

      <Dialog open={isMentionDialogOpen} onOpenChange={setIsMentionDialogOpen} modal={true}>
        <DialogContent className="max-w-full sm:max-w-[700px]">
          <Card className="p-4">
            <PostComposer user={authedUser} initialContent={`@lens/${user.handle} `} onSuccess={() => setIsMentionDialogOpen(false)} />
          </Card>
        </DialogContent>
      </Dialog>

      {isUserProfile && (
        <EditProfileModal
          user={user}
          open={isEditProfileOpen}
          onOpenChange={setIsEditProfileOpen}
          onSuccess={() => {
            window.location.reload();
          }}
        />
      )}
    </Card>
  );
};
