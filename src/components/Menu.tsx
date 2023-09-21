import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { createContext, useState } from "react";
import { toast } from "react-hot-toast";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/src/components/ui/dialog";
import {
	FiBell,
	FiHome,
	FiLogIn,
	FiLogOut,
	FiMail,
	FiSettings,
	FiUser,
} from "react-icons/fi";
import { RiQuillPenLine } from "react-icons/ri";
import { api } from "~/utils/api";
import { OtterIcon } from "./Icons";
import PingAuth from "./Auth";
import { MenuItem } from "./MenuItem";
import PostWizard from "./PostWizard";
import { SidebarButtons } from "./Sidebar";
import { SignedOut } from "./Signed";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
	AtSign,
	BellIcon,
	HomeIcon,
	LogInIcon,
	LogOutIcon,
	MailIcon,
	MessagesSquareIcon,
	PenIcon,
	SettingsIcon,
	User2Icon,
	UserIcon,
} from "lucide-react";

export const CollapsedContext = createContext(false);

export default function Menu() {
	const [isCollapsed] = useState(false);
	const supabase = useSupabaseClient();
	const ctx = api.useContext();
	const user = useUser();

	const signOut = () => {
		void ctx.invalidate();
		void supabase.auth.signOut();
	};

	return (
			<div
				className={
					"sticky top-0 flex h-screen w-max shrink flex-col place-content-between py-4 text-2xl sm:px-2 lg:w-56"
				}
			>
				<div className="flex flex-col items-end gap-2">
					<Link href="/">
						<Button variant="ghost">
							<div className="hidden sm:flex">ping</div>
							<AtSign className="sm:ml-2" />
						</Button>
					</Link>

					<div className="flex flex-col items-end gap-2 md:hidden">
						<SidebarButtons />
					</div>

					{user ? (
						<MenuAuthed userId={user.id} />
					) : (
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="ghost">
									<div className="hidden sm:flex">sign in</div>
									<LogInIcon className="sm:ml-2" />
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[350px]">
								<DialogTitle>
									<h3 className="text-center">Sign in to Ping </h3>
								</DialogTitle>
								<PingAuth />
							</DialogContent>
						</Dialog>
					)}

						<Dialog>
							<DialogTrigger asChild>
								<Button variant="ghost">
									<div className="hidden sm:flex">post</div>
									<PenIcon className="sm:ml-2" />
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[700px]">
								<PostWizard placeholder="Write a new post..." />
							</DialogContent>
						</Dialog>
				</div>
			</div>
	);
}

export const MenuAuthed = ({ userId }: { userId: string }) => {
	const { data: profile } = api.profiles.get.useQuery({
		id: userId,
	});
	const supabase = useSupabaseClient();
	const ctx = api.useContext();
	const user = useUser();

	const signOut = () => {
		void ctx.invalidate();
		void supabase.auth.signOut();
	};

	const todo = () => toast.error("Not implemented yet");

	return (
		<>
			<Link href={`${profile?.username ? `/${profile.username}` : undefined}`}>
				<Button variant="ghost">
					<div className="hidden sm:flex">profile</div>
					<UserIcon className="sm:ml-2" />
				</Button>
			</Link>
			<Button variant="ghost">
				<div className="hidden sm:flex">messages</div>
				<MailIcon className="sm:ml-2" />
			</Button>
			<Button variant="ghost">
				<div className="hidden sm:flex">notifications</div>
				<BellIcon className="sm:ml-2" />
			</Button>
			<Button variant="ghost">
				<div className="hidden sm:flex">settings</div>
				<SettingsIcon className="sm:ml-2" />
			</Button>

			<Button variant="ghost" onClick={() => signOut()}>
				<div className="hidden sm:flex">sign out</div>
				<LogOutIcon className="sm:ml-2" />
			</Button>
		</>
	);
};
