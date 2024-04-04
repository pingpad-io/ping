import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip";
import type { Reaction } from "@prisma/client";
import { useUser } from "@supabase/auth-helpers-react";
import {
  AlertCircleIcon,
  CheckIcon,
  HeartIcon,
  HelpCircleIcon,
  LightbulbIcon,
  PartyPopperIcon,
  XIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import type { Post } from "~/server/api/routers/posts";
import { api } from "~/utils/api";
import { Button } from "../components/ui/button";

type PostReaction = Post["reactions"][number];

export const ReactionBadge = ({ reaction, post }: { reaction: PostReaction | Reaction; post: Post }) => {
  const user = useUser();
  const ctx = api.useContext();

  const count = "count" in reaction ? reaction.count : 0;
  const id = "id" in reaction ? reaction.id : reaction.reactionId;
  const profiles = "profileIds" in reaction ? reaction.profileIds : [];
  const personText = count === 0 ? " I " : count === 1 ? " person " : " people ";
  const tooltipText = (count > 0 ? count : "") + personText + reaction.description;

  const { mutate: react } = api.reactions.react.useMutation({
    onSuccess: () => {
      ctx.posts.invalidate();
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const isUserReacted = profiles.find((profileId) => user && profileId === user.id);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isUserReacted ? "accent" : "outline"}
            size="icon"
            className={`h-6 ${count > 0 ? "w-10" : "w-8"}`}
            onClick={() =>
              user
                ? react({
                    profileId: user.id,
                    postId: post.id,
                    reactionId: id,
                  })
                : () => {}
            }
          >
            <span className={"flex flex-row gap-1 leading-3"}>
              {count > 0 ? count : <></>}
              <ReactionIcon reaction={reaction.name} />
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ReactionIcon = ({ reaction }: { reaction: string }) => {
  switch (reaction) {
    case "Like":
      return <HeartIcon size={14} />;
    case "Agree":
      return <CheckIcon size={14} />;
    case "Disagree":
      return <XIcon size={14} />;
    case "Question":
      return <HelpCircleIcon size={14} />;
    case "Important":
      return <AlertCircleIcon size={14} />;
    case "Insightful":
      return <LightbulbIcon size={14} />;
    case "Exciting":
      return <PartyPopperIcon size={14} />;
    default:
      return <></>;
  }
};
