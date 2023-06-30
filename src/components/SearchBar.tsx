import { useState } from "react";
import { useRouter } from "next/router";
import { FiSearch } from "react-icons/fi";
import { MenuItem } from "~/components/MenuItem";

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
			<div className="w-full flex">
				<form
					className="relative flex w-full flex-row justify-center gap-4"
					onSubmit={onSubmit}
				>
					<input
						type="text"
						className="input-bordered border-base-300 input input-md w-full"
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
		</>
	);
};
