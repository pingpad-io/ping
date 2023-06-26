import { api } from "~/utils/api";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { FiSearch } from "react-icons/fi";
import { MenuItem } from "~/components/MenuItem";
import { PageLayout } from "~/components/Layout";
import Feed from "~/components/Feed";
import ErrorPage from "~/components/ErrorPage";
import Link from "next/link";

export default function SearchPage() {
	const router = useRouter();
	const { q: query } = router.query;

	if (!query || typeof query !== "string")
		return (
			<PageLayout>
				<SearchBar defaultText="" />
			</PageLayout>
		);

	const posts = api.posts.find.useQuery(query, {
		onError: (e) => {
			let error = "Something went wrong";
			switch (e.data?.code) {
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

	return (
		<PageLayout>
			<div className="flex flex-col justify-center px-2">
				<div className="rounded-box sticky top-0 z-20 flex w-full flex-row justify-center border bg-base-100/30 p-4 backdrop-blur-sm ">
					<SearchBar defaultText={query} />
				</div>
				<Feed {...posts} />
				<Link className="btn-ghost btn" href={"/"}>
					{"< Home"}
				</Link>
			</div>
		</PageLayout>
	);
}

export const SearchBar = ({ defaultText }: { defaultText: string }) => {
	const [input, setInput] = useState(defaultText);
	const router = useRouter();

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!input) return;
		router.push(`/search?q=${input}`).catch(console.error);
	};
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};

	return (
		<>
			<div className="hidden w-full xl:flex">
				<form
					className="relative flex w-full flex-row justify-center gap-4"
					onSubmit={onSubmit}
				>
					<input
						type="text"
						className="input-bordered input input-md w-full"
						placeholder={"Search Twotter..."}
						value={input}
						onChange={onChange}
					/>

					<button
						className="btn-ghost btn-sm btn absolute w-8 h-8 inset-y-2 right-2 p-0"
						type="submit"
					>
						<FiSearch size={20} />
					</button>
				</form>
			</div>

			<div className="xl:hidden">
				<MenuItem href="/search" icon={<FiSearch size={24} />} />
			</div>
		</>
	);
};
