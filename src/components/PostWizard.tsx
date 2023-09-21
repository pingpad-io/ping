"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
} from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { KeyboardEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import toast, { LoaderIcon } from "react-hot-toast";
import * as z from "zod";
import { api } from "~/utils/api";
import { UserAvatar } from "./UserAvatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { SendHorizontalIcon } from "lucide-react";

export default function PostWizard({
	placeholder,
	replyingTo,
}: { placeholder: string; replyingTo?: string }) {
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
				form.setValue("content", "");
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

	const updateHeight = () => {
		if (textarea.current) {
			textarea.current.style.height = "auto";
			textarea.current.style.height = `${textarea.current.scrollHeight+2}px`;
		}
	};

	const FormSchema = z.object({
		content: z.string().max(3000, {
			message: "Post must not be longer than 3000 characters.",
		}),
	});

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		createPost({
			content: data.content,
			threadName: thread,
			repliedToId: replyingTo,
		});
	}

	const onChange = () => {
		updateHeight();
	};

	const onKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
		if (event.key === "Enter" && event.ctrlKey) {
			// FIXME: it doesn't work
			form.handleSubmit(onSubmit);
		}
	};

	return (
		<div className="p-4 backdrop-blur-sm">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					onChange={onChange}
					onKeyDown={onKeyDown}
					className="flex flex-row gap-2 w-full h-fit place-items-end"
				>
					{user && <PostAvatar userId={user.id} />}
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem className="grow">
								<FormControl>
									<Textarea
										{...field}
										placeholder={placeholder}
										disabled={isPosting}
										className="min-h-12 resize-none"
										ref={textarea}
										rows={1}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormControl>
						<Button size="icon">
							{isPosting ? <LoaderIcon /> : <SendHorizontalIcon />}
						</Button>
					</FormControl>
				</form>
			</Form>
		</div>
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

export const PostAvatar = ({ userId }: { userId: string }) => {
	const { data: profile } = api.profiles.get.useQuery({
		id: userId,
	});

	return (
		<div className="w-10 h-10 shrink-0 grow-0">
			<UserAvatar profile={profile} />
		</div>
	);
};
