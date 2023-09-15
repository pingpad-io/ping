import Link from "next/link";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FiGlobe, FiSearch } from "react-icons/fi";
import { CollapsedContext } from "./Menu";
import { MenuItem } from "./MenuItem";
import { ThreadLink } from "./ThreadLink";
import Threads from "./Threads";
import { useRouter } from "next/router";
import { SearchBar } from "./SearchBar";
import { Button } from "~/components/ui/button";
import { SearchIcon } from "lucide-react";

const Links = () => {
	return (
		<>
			<div className="hidden h-fit w-fit flex-row flex-wrap gap-2 overflow-auto text-sm text-base-content xl:flex">
				<Link className=" hover:underline" href={"/policy"}>
					Privacy Policy
				</Link>
				<Link className=" hover:underline" href={"/conditions"}>
					Terms of Service
				</Link>
				<Link className=" hover:underline" href={"/about"}>
					About
				</Link>
				<a href="https://kualta.dev/" className="select-none">
					© 2023 K.U Corp.
				</a>
			</div>
		</>
	);
};

const ThreadsBar = () => {
	return (
		<>
			<div className="rounded-box hidden bg-base-200 xl:flex">
				<Threads />
			</div>

			<div className="flex flex-col gap-2 xl:hidden">
				<MenuItem href="/t" icon={<BiMessageSquareDetail size={24} />} />
				<ThreadLink thread="global">
					<MenuItem icon={<FiGlobe size={24} />} />
				</ThreadLink>
			</div>
		</>
	);
};

export const SidebarButtons = () => {
	const router = useRouter();
	const pathname = router.pathname;

	return (
		<CollapsedContext.Provider value={true}>
			{pathname !== "/search" && (
				<>
					<div className="hidden xl:flex">
						<SearchBar defaultText="" />
					</div>
					<div className="xl:hidden">
						<Link href={"/search"}>
							<Button variant="ghost" className="text-2xl">
								search
								<SearchIcon className="ml-2" />
							</Button>
						</Link>
					</div>
				</>
			)}
			<ThreadsBar />
			<Links />
		</CollapsedContext.Provider>
	);
};

export default function Sidebar() {
	return (
		<div className="sticky top-0 hidden h-screen w-max max-w-xs shrink flex-col gap-2 py-4 sm:px-2 md:flex xl:gap-4">
			<SidebarButtons />
		</div>
	);
}
