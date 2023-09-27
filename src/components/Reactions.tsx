import { Post } from "~/server/api/routers/posts";
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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Button } from "./ui/button";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

export const ReactionBadge = ({
	reaction,
	post,
}: { reaction: Post["reactions"][number]; post: Post }) => {
	const user = useUser();

	const personText = reaction.count <= 1 ? " person " : " people ";
	const tooltipText = reaction.count + personText + reaction.description;
	const ctx = api.useContext();

	const { mutate: react } = api.reactions.react.useMutation({
		onError: (e) => {
			toast.error(e.message);
		},
		onSuccess: () => {
			ctx.posts.invalidate();
		},
	});

	if (!user) return null;

	const isUserReacted = reaction.profileIds.find(
		(profileId) => profileId === user.id,
	);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant={isUserReacted ? "secondary" : "ghost"}
						size="icon"
						className="w-10 h-6"
						onClick={(_e) =>
							react({
								profileId: user.id,
								postId: post.id,
								reactionId: reaction.reactionId,
							})
						}
					>
						<span className={"flex flex-row gap-1 leading-3 rounded-xl"}>
							{reaction.count}
							<ReactionToIcon reaction={reaction.name} />
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

export const ReactionToIcon = ({ reaction }: { reaction: string }) => {
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
