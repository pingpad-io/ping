import { Post } from "~/server/api/routers/posts";

const Metadata = ({ metadata }: { metadata: Post["metadata"] }) => {
	if (!metadata) {
		return <></>;
	}

	return (
		<span className="max-w-sm min-w-0">
			<span className="rounded-lg border text-card-foreground shadow-sm bg-slate-100 select-none truncate line-clamp-1 dark:bg-slate-900 mt-2 sm:mt-4 p-2 sm:p-4 flex flex-col gap-2">
				<a href={metadata.url} className="no-underline">
					{metadata.publisher && <span>{metadata.publisher}</span>}
					<span className="truncate hover:underline"> {metadata.title} </span>
				</a>
				<a href={metadata.url} className="no-underline">
					{metadata.image && (
						<img
							className="rounded-lg m-0 mt-4"
							src={metadata.image}
							alt={`${metadata.title} preview`}
						/>
					)}
				</a>
			</span>
		</span>
	);
};

export default Metadata;
