/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export default function ProfileSettingsView({ profile }: { profile: Profile }) {
	const { mutate: updateProfile, isLoading } = api.profiles.update.useMutation({
		onSuccess() {
			toast.success("Profile updated!");
		},
		onError(error) {
			toast.error(`Error updating the data! ${error.message}`);
		},
	});

	function onSubmit(values: Profile) {
		const updates = {
			id: profile.id,
			created_at: profile.created_at,
			username: values.username,
			full_name: values.full_name,
			description: values.description,
			avatar_url: values.avatar_url,
			updated_at: new Date(),
		};

		updateProfile({ updates });
	}

	const formSchema = z.object({
		username: z
			.string()
			.min(2, {
				message: "Username must be at least 2 characters.",
			})
			.max(20, {
				message: "Username must be shorter than 20 characters.",
			}),
		full_name: z
			.string()
			.min(2, {
				message: "Name must be at least 2 characters.",
			})
			.max(32),
		description: z.string().max(160, {
			message: "Description must be shorter than 160 characters",
		}),
	});

	const form = useForm<Profile>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: profile.username,
			full_name: profile.full_name,
			description: profile.description,
			avatar_url: profile.avatar_url,
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile Settings</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							disabled={isLoading}
							name="full_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										{/* FIXME: why name can be null? */}
										<Input
											placeholder="Full Name"
											{...field}
											value={field.value ?? undefined}
										/>
									</FormControl>
									<FormDescription>Your public name</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							disabled={isLoading}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										{/* FIXME: why username can be null? */}
										<Input
											placeholder="Username"
											{...field}
											value={field.value ?? undefined}
										/>
									</FormControl>
									<FormDescription>
										Your username that comes after `@`
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							disabled={isLoading}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bio</FormLabel>
									<FormControl>
										{/* FIXME: why description can be null? */}
										<Textarea
											placeholder="Bio"
											{...field}
											value={field.value ?? undefined}
										/>
									</FormControl>
									<FormDescription>Your profile bio</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Submit</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
