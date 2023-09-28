import { useUser } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { CompactMenuItem } from "./MenuItem";
import { SignedIn } from "./Signed";
import { Post } from "~/server/api/routers/posts";
import { ReactionsList } from "./ReactionsList";
import {
	EditIcon,
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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "./ui/button";

export const PostMenu = ({ post }: { post: Post }) => {
	const user = useUser();
	const ctx = api.useContext();

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
						<MoreHorizontalIcon size={14} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>
						<ReactionsList post={post} />
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{user?.id === author.id && (
						<>
							<DropdownMenuItem>
								<CompactMenuItem
									onClick={todo}
									side="left"
									icon={<EditIcon size={14} />}
									text="edit post"
								/>
							</DropdownMenuItem>

							<DropdownMenuItem>
								<CompactMenuItem
									onClick={() => {
										deletePost(post.id);
									}}
									side="left"
									icon={<TrashIcon size={14} />}
									text="delete post"
								/>
							</DropdownMenuItem>
						</>
					)}
					<DropdownMenuItem>
						<CompactMenuItem
							href={`/p/${post.id}`}
							side="left"
							icon={<ReplyIcon size={14} />}
							text="reply"
						/>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<CompactMenuItem
							onClick={() => {
								copyLink();
							}}
							side="left"
							icon={<LinkIcon size={14} />}
							text="copy link"
						/>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</SignedIn>
	);
};
