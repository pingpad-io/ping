import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import metascraper from "metascraper";
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
			{content}
			<a href={content}>
				<Card className="p-4 max-w-xs flex flex-col gap-2">
					<p className=" font-bold truncate whitespace-pre-wrap break-words text-sm/tight sm:text-base/tight line-clamp-1">
						{metadata.title}
					</p>
					<span className="truncate whitespace-pre-wrap break-words text-sm/tight sm:text-base/tight line-clamp-1">
						{metadata.description}
					</span>
					<img
						className="rounded-lg m-0 mt-4"
						src={metadata.image}
						alt="Preview"
					/>
				</Card>
			</a>
		</>
	);
};

export default LinkPreview;
