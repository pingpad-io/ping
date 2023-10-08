import { Post } from "~/server/api/routers/posts";

const Metadata = ({ metadata }: { metadata: Post["metadata"] }) => {
	if (!metadata) {
		return <></>;
	}

	return (
		<span
			className="max-w-md min-w-0 w-max
				rounded-lg border text-card-foreground shadow-sm select-none truncate line-clamp-1 
				bg-slate-100 dark:bg-slate-900 mt-2 sm:mt-4 p-2 sm:p-4 flex flex-col gap-2 "
		>
			<a href={metadata.url} className="select-none truncate">
				{metadata.publisher && <span>{metadata.publisher}</span>}
			</a>
			<a href={metadata.url} className="truncate hover:underline">
				{metadata.title}
			</a>
			{metadata.image && (
				<a href={metadata.url} className="">
					<img
						className="rounded-lg m-0 mt-4"
						src={metadata.image}
						alt={`${metadata.title} preview`}
					/>
				</a>
			)}
		</span>
	);
};

export default Metadata;
