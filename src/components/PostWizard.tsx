import { useUser } from "@supabase/auth-helpers-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { UserAvatar } from "./UserAvatar";
import { GlassBar } from "./GlassBar";
import { useRouter } from "next/router";

export default function PostWizard({
	placeholder,
	replyingTo,
}: { placeholder: string; replyingTo?: string }) {
	const [input, setInput] = useState("");
	const ctx = api.useContext();
	const user = useUser();
	const router = useRouter();
	const thread = replyingTo
		? undefined
		: router.asPath.split("/")[2] ?? "global";
	const textarea = useRef<HTMLTextAreaElement>(null);

	const { mutate: createPost, isLoading: isPosting } =
		api.posts.create.useMutation({
			onSettled: (e) => {
				updateHeight();
			},
			onSuccess: async () => {
				setInput("");
				await ctx.posts.invalidate();
			},
			onError: (e) => {
				let error = "Something went wrong";
				switch (e.data?.code) {
					case "UNAUTHORIZED":
						error = "You must be logged in to post";
						break;
					case "FORBIDDEN":
						error = "You are not allowed to post";
						break;
					case "TOO_MANY_REQUESTS":
						error = "Slow down! You are posting too fast";
						break;
					case "BAD_REQUEST":
						error = "Invalid request";
						break;
					case "PAYLOAD_TOO_LARGE":
						error = "Your message is too big";
						break;
				}
				toast.error(error);
			},
		});

	const submitPost = () => {
		createPost({
			content: input,
			threadName: thread,
			repliedToId: replyingTo,
		});
	};

	const updateHeight = () => {
		if (textarea.current) {
			console.log("here");
			textarea.current.style.height = "auto";
			textarea.current.style.height = `${textarea.current.scrollHeight}px`;
		}
	};

	const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Enter" && event.ctrlKey) {
			submitPost();
		}
	};

	const onInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(event.target.value);
		updateHeight();
	};

	return (
		<GlassBar>
			{user && <PostWizardAuthed userId={user.id} />}
			<form
				className="flex w-full flex-row gap-4"
				onSubmit={(_e) => submitPost()}
			>
				<textarea
					ref={textarea}
					className="textarea min-h-2 text-base h-2 overflow-hidden resize-none shrink grow"
					rows={1}
					placeholder={placeholder}
					onKeyDown={onKeyDown}
					onChange={onInputChange}
					value={input}
					disabled={isPosting}
				/>
				{isPosting ? (
					<div className="btn-outline loading btn-circle btn" />
				) : (
					input !== "" && (
						<button className="btn-outline btn-primary btn w-16" type="submit">
							Post
						</button>
					)
				)}
			</form>
		</GlassBar>
	);
}

export const ThreadDivider = () => {
	const router = useRouter();
	const thread = router.asPath.split("/")[2];

	return (
		<div className="divider z-20 mx-2 -mt-2 mb-2 before:h-0 before:border-b before:border-base-300 after:h-0 after:border-b after:border-base-300">
			{thread}
		</div>
	);
};

export const PostWizardAuthed = ({ userId }: { userId: string }) => {
	const { data: profile } = api.profiles.get.useQuery({
		id: userId,
	});

	return (
		<div className="w-12 h-12 shrink-0 grow-0">
			<UserAvatar profile={profile} online={true} />
		</div>
	);
};
