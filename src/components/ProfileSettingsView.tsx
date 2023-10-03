/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from "react";
import { toast } from "react-hot-toast";
import { api, type RouterOutputs } from "~/utils/api";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Card, CardHeader } from "./ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Profile = RouterOutputs["profiles"]["get"];

export default function ProfileSettingsView({ profile }: { profile: Profile }) {
	const [loading, setLoading] = useState(false);
	const [username, setUsername] = useState(profile.username);
	const [full_name, setFullName] = useState(profile.full_name);
	const [description, setDescription] = useState(profile.description);
	const [avatar_url, setAvatarUrl] = useState(profile.avatar_url);

	const { mutate: updateProfile } = api.profiles.update.useMutation({
		onSuccess() {
			toast.success("Profile updated!");
			setLoading(false);
		},
		onError(error) {
			toast.error(`Error updating the data! ${error.message}`);
		},
	});
	
function onSubmit(values: z.infer<typeof profile>) {
		const updates = {
			id: profile.id,
			username,
			full_name,
			description,
			avatar_url,
			updated_at: new Date(),
			created_at: profile?.created_at ?? null,
		};

		updateProfile({ updates });
  }

	// FIXME
	// const form = useForm<z.infer<typeof profile>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     username: "",
  //   },
  // })


	return (
		<Card>
			<Form {...form}>
			<h2 className="text-xl">Account Settings</h2>
			<div className="w-full">
				<label className="label inline-block" htmlFor="id">
					Your ID:
				</label>
				<Input
					className="w-[295px]"
					id="id"
					type="text"
					value={profile.id}
					disabled
				/>
			</div>
			<div>
				<label className="label inline-block" htmlFor="name">
					Full Name:
				</label>
				<Input
					className=""
					id="name"
					type="text"
					value={full_name ?? ""}
					onChange={(e) => setFullName(e.target.value)}
				/>
			</div>
			<div>
				<label className="label inline-block" htmlFor="description">
					Bio:
				</label>
				<input
					className="textarea textarea-bordered textarea-wide"
					id="description"
					type="text"
					value={description ?? ""}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</div>
			<div>
				<label className="label inline-block" htmlFor="username">
					Username:
				</label>
				<div className="inline-block">
					<label className="">
						<span className="px-2">@</span>
						<Input
							className=""
							id="username"
							type="text"
							value={username ?? ""}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</label>
				</div>
			</div>

			<div>
				<button
					type="submit"
					className="btn-outline btn-primary btn-wide btn mt-4"
					onClick={() => commitUpdates()}
					disabled={false}
				>
					{loading ? "Updating..." : "Update"}
				</button>
			</div>

			</Form>
		</Card>
	);
}
