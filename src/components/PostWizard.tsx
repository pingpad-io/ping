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
import { KeyboardEvent, KeyboardEventHandler, useRef } from "react";
import { useForm } from "react-hook-form";
import toast, { LoaderIcon } from "react-hot-toast";
import * as z from "zod";
import { api } from "~/utils/api";
import { UserAvatar } from "./UserAvatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { MenuIcon, SendHorizontalIcon } from "lucide-react";
import { Separator } from "./ui/separator";

export default function PostWizard({ replyingTo }: { replyingTo?: string }) {
	const ctx = api.useContext();
	const user = useUser();
	const router = useRouter();
	const thread = replyingTo
		? undefined
		: router.asPath.split("/")[2] ?? "global";
	const textarea = useRef<HTMLTextAreaElement>(null);
	const placeholderText = replyingTo
		? "write a reply..."
		: `write a new post in ${thread}...`;

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
			textarea.current.style.height = `${textarea.current.scrollHeight + 2}px`;
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

	const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.ctrlKey && event.key === "Enter") {
			onSubmit(form.getValues());
		}
	};

	return (
		<div className="p-4 backdrop-blur-sm">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					onChange={onChange}
					className="flex flex-row gap-2 w-full h-fit place-items-end"
				>
					<AvatarMenu userId={user?.id} />
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem className="grow">
								<FormControl>
									<Textarea
										{...field}
										onKeyDown={onKeyDown}
										placeholder={placeholderText}
										disabled={isPosting}
										className="min-h-12 resize-none"
										ref={textarea}
										rows={1}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<Button size="icon" type="submit">
						{isPosting ? <LoaderIcon /> : <SendHorizontalIcon />}
					</Button>
				</form>
			</Form>
		</div>
	);
}

export const AvatarMenu = ({ userId }: { userId?: string | null }) => {
	if (!userId)
		return (
			<div>
				<MenuIcon />
			</div>
		);

	return (
		<div className="w-10 h-10 shrink-0 grow-0">
			<UserAvatar userId={userId} />
		</div>
	);
};
