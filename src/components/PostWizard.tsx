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

	const { mutate: createPost, isLoading: isPosting } =
		api.posts.create.useMutation({
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

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		submitPost();
	};

	const onKeyDownTextarea = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Enter" && event.ctrlKey) {
			submitPost();
		}
	};

	const postButton = isPosting ? (
		<div className="btn-outline loading btn-circle btn" />
	) : (
		input !== "" && (
			<button className="btn-outline btn-primary btn w-16" type="submit">
				Twot
			</button>
		)
	);

	return (
		<GlassBar>
			{user && <PostWizardAuthed userId={user.id} />}
			<form className="flex w-full flex-row gap-4" onSubmit={onSubmit}>
				<textarea
					className="border-base-300 textarea textarea-xs text-base h-4 textarea-bordered shrink grow"
					placeholder={placeholder}
					onKeyDown={(e) => onKeyDownTextarea(e)}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					disabled={isPosting}
				/>
				{postButton}
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
