import React from "react";
import { api } from "~/utils/api";
import { Card } from "./ui/card";

interface Metadata {
	title: string;
	description: string;
	image: string;
}

interface LinkPreviewProps {
	content: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ content }) => {
	const { data: metadata } = api.metadata.get.useQuery({ url: content });

	if (!metadata) {
		return <span>Loading preview...</span>;
	}

	return (
		<>
				<a className="truncate no-underline hover:underline" href={content}>
					{metadata.url}
				</a>
			<div className="max-w-md min-w-fit w-min w-min">

				<Card className="bg-slate-100 select-none truncate line-clamp-1 dark:bg-slate-900 mt-4 p-4 flex flex-col gap-2">
					{metadata.publisher && <span>{metadata.publisher}</span>}
					<a href={content} className="no-underline hover:underline">
						<span className="truncate"> {metadata.title} </span>
						{metadata.image && (
							<img
								className="rounded-lg m-0 mt-4"
								src={metadata.image}
								alt={`${metadata.title} preview`}
							/>
						)}
					</a>
				</Card>
			</div>
		</>
	);
};

export default LinkPreview;
