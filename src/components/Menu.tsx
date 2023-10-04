import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/src/components/ui/dialog";
import { useUser } from "@supabase/auth-helpers-react";
import {
	AtSign,
	BellIcon,
	LogInIcon,
	MailIcon,
	MessagesSquare,
	SearchIcon,
	SendIcon,
	SettingsIcon,
	UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { createContext } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import PingAuth from "./Auth";
import PostWizard from "./PostWizard";

export const CollapsedContext = createContext(false);

export default function Menu() {
	const router = useRouter();
	const pathname = router.pathname;
	const user = useUser();

	return (
		<div
			className={
				"sticky top-0 hidden sm:flex h-screen w-max shrink flex-col py-4 text-2xl sm:px-2 lg:w-56"
			}
		>
			<div className="flex flex-col items-end gap-2">
				<Link href="/">
					<Button variant="ghost" size="sm_icon">
						<div className="hidden sm:flex">ping</div>
						<AtSign className="sm:ml-2" />
					</Button>
				</Link>

				<div className="flex flex-col items-end gap-2 lg:hidden">
					{pathname !== "/search" && (
						<Link href={"/search"} className="xl:hidden text-2xl">
							<Button variant="ghost" size="sm_icon">
								<div className="hidden sm:flex text-2xl">search</div>
								<SearchIcon className="sm:ml-2" />
							</Button>
						</Link>
					)}
					<Link href={"/t"} className="xl:hidden text-2xl">
						<Button variant="ghost" size="sm_icon" className="xl:hidden">
							<div className="hidden sm:flex text-2xl">threads</div>
							<MessagesSquare className="sm:ml-2" />
						</Button>
					</Link>
				</div>

				{user ? (
					<MenuAuthed userId={user.id} />
				) : (
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="default" size="sm_icon">
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

			</div>
		</div>
	);
}

export const MenuAuthed = ({ userId }: { userId: string }) => {
	const { data: profile } = api.profiles.get.useQuery({
		id: userId,
	});

	return (
		<>
			<Link href="/messages">
				<Button variant="ghost" size="sm_icon">
					<div className="hidden sm:flex">messages</div>
					<MailIcon className="sm:ml-2" />
				</Button>
			</Link>

			<Link href="/notifications">
				<Button variant="ghost" size="sm_icon">
					<div className="hidden sm:flex">notifications</div>
					<BellIcon className="sm:ml-2" />
				</Button>
			</Link>

			<Link href="/settings">
				<Button variant="ghost" size="sm_icon">
					<div className="hidden sm:flex">settings</div>
					<SettingsIcon className="sm:ml-2" />
				</Button>
			</Link>

			<Link href={`${profile?.username ? `/${profile.username}` : undefined}`}>
				<Button variant="ghost" size="sm_icon">
					<div className="hidden sm:flex">profile</div>
					<UserIcon className="sm:ml-2" />
				</Button>
			</Link>

				<Dialog>
					<DialogTrigger asChild>
						<Button>
							<div className="hidden sm:flex">post</div>
							<SendIcon className="sm:ml-2" />
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[700px]">
						<PostWizard />
					</DialogContent>
				</Dialog>
		</>
	);
};
