import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
// import dynamic from "next/dynamic";

// const ReactMarkdown = dynamic(() => import("react-markdown"), {
//   loading: () => <p>Loading...</p>,
// })

// const SyntaxHighlighter = dynamic(() => import("react-syntax-highlighter"), {
// 	loading: () => <p>Loading...</p>,
// });

// import { PrismLight  } from "react-syntax-highlighter";
// import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
// import rust from "react-syntax-highlighter/dist/esm/languages/prism/rust";
// import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";

// PrismLight.registerLanguage('typescript', typescript);
// PrismLight.registerLanguage('rust', rust);
// PrismLight.registerLanguage('cpp', cpp);

interface MarkdownProps {
  content: string;
}

function Markdown({ content }: MarkdownProps) {
  return (
    <ReactMarkdown
      className="prose dark:prose-invert prose-p:m-0 prose-p:inline prose-ul:m-0 prose-h2:m-0 prose-h1:m-0 prose-li:m-0 prose-li:whitespace-normal prose-ul:leading-4 prose-ol:leading-4 prose-ol:m-0"
      remarkPlugins={[remarkGfm]}
      components={{
        h1: "h2",
        // code({ node, inline, className, children, ...props }) {
        // const match = /language-(\w+)/.exec(className || "");
        // return !inline && match ? (
        // 	<SyntaxHighlighter
        // 		{...props}
        // 		children={String(children).replace(/\n$/, "")}
        // 		style={vscDarkPlus}
        // 		language={match[1]}
        // 		PreTag="div"
        // 		customStyle={{
        // 			display: undefined,
        // 			overflowX: undefined,
        // 			padding: undefined,
        // 			color: undefined,
        // 			background: undefined,
        // 		}}
        // 	/>
        // ) : (

        // <code {...props} className={className}>
        // 	{children}
        // </code>;
        // );
        // },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default Markdown;
