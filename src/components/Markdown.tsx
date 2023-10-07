import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Metadata from "~/pages/metadata/[url]";

interface MarkdownProps {
	content: string;
}

function Markdown({ content }: MarkdownProps) {
	return (

		<ReactMarkdown
			className="prose dark:prose-invert"
			remarkPlugins={[remarkGfm]}
			components={{
				h1: "h2",
				a: ({ node, ...props }) => props.href ? <Metadata url={props.href} />: <></>,
				code({ node, inline, className, children, ...props }) {
					const match = /language-(\w+)/.exec(className || "");
					return !inline && match ? (
						<SyntaxHighlighter
							{...props}
							children={String(children).replace(/\n$/, "")}
							style={vscDarkPlus}
							language={match[1]}
							PreTag="div"
							customStyle={{
								display: undefined,
								overflowX: undefined,
								padding: undefined,
								color: undefined,
								background: undefined,
							}}
						/>
					) : (
						<code {...props} className={className}>
							{children}
						</code>
					);
				},
			}}
		>
			{content}
		</ReactMarkdown>
	);
}

export default Markdown;
