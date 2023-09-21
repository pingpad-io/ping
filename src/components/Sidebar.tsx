import Link from "next/link";
import Threads from "./Threads";
import { useRouter } from "next/router";
import { SearchBar } from "./SearchBar";
import { Button } from "~/components/ui/button";
import { MessagesSquare, SearchIcon } from "lucide-react";

const Links = () => {
	return (
		<div className="h-fit w-fit flex-row flex-wrap gap-2 overflow-auto text-sm text-base-content flex">
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
	);
};

export default function Sidebar() {
	return (
		<div className="hidden lg:flex sticky top-0 h-screen w-max max-w-xs shrink flex-col gap-2 py-4 sm:px-2 xl:gap-4">
			<SearchBar defaultText="" />
			<Threads />
			<Links />
		</div>
	);
}
