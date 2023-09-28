import { useUser } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { CompactMenuItem } from "./MenuItem";
import { SignedIn } from "./Signed";
import { Post } from "~/server/api/routers/posts";
import { ReactionsList } from "./ReactionsList";
import {
	EditIcon,
	HeartIcon,
	LinkIcon,
	MoreHorizontalIcon,
	ReplyIcon,
	TrashIcon,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import {
	DropdownMenuArrow,
	DropdownMenuSub,
	DropdownMenuSubContent,
} from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/router";
import { Card } from "./ui/card";

export const PostMenu = ({ post }: { post: Post }) => {
	const user = useUser();
	const ctx = api.useContext();
	const router = useRouter();

	const author = post.author;
	const origin =
		typeof window !== "undefined" && window.location.origin
			? window.location.origin
			: "";
	const postLink = `${origin}/p/${post.id}`;

	const todo = () => {
		toast.error("Not	implemented yet");
	};

	const { mutate: deletePost } = api.posts.delete.useMutation({
		onSuccess: async () => {
			await ctx.posts.invalidate();
		},
		onError: (error) => {
			toast.error(`Error deleting post ${error.message}`);
		},
	});

	const copyLink = () => {
		navigator.clipboard.writeText(postLink).then(
			function () {
				toast.success("Copied link to clipboard");
			},
			function () {
				toast.error("Error copying link to clipboard!");
			},
		);
	};

	return (
		<SignedIn>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button type="button" size="icon" className="w-6 h-4" variant="ghost">
						<MoreHorizontalIcon className="w-4 h-4" strokeWidth={1} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<HeartIcon size={14} className="mr-2 h-4 w-4" />
							reactions
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<Card className="p-1 -mt-1 ml-2">
									<ReactionsList post={post} />
								</Card>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuItem onClick={() => router.push(`/p/${post.id}`)}>
						<ReplyIcon size={14} className="mr-2 h-4 w-4" />
						reply
					</DropdownMenuItem>
					<DropdownMenuItem onClick={copyLink}>
						<LinkIcon size={14} className="mr-2 h-4 w-4" />
						copy link
					</DropdownMenuItem>
					{user?.id === author.id && (
						<>
							<DropdownMenuItem onClick={todo}>
								<EditIcon size={14} className="mr-2 h-4 w-4" />
								edit post
							</DropdownMenuItem>

							<DropdownMenuItem
								onClick={() => {
									deletePost(post.id);
								}}
							>
								<TrashIcon size={14} className="mr-2 h-4 w-4" />
								delete post
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</SignedIn>
	);
};
