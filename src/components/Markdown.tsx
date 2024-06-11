import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { UserHandleCard } from "./user/UserCard";

const BASE_URL = getBaseUrl();

function replaceHandles(content) {
  if (!content || typeof content !== "string") {
    return content;
  }

  const handleRegex = /@(\w+\/\w+|\w+)/g;
  const processedContent = content.replace(handleRegex, (_, p1) => {
    const handle = p1.split("/")[1];
    return `${BASE_URL}u/${handle}`;
  });

  return processedContent;
}

function Markdown({ content }: { content: string }) {
  const processedContent = replaceHandles(content);

  return (
    <ReactMarkdown
      className="prose dark:prose-invert prose-p:m-0 prose-p:inline 
      prose-ul:m-0 prose-h2:m-0 prose-h1:m-0 prose-li:m-0 prose-li:whitespace-normal 
      prose-ul:leading-4 prose-ol:leading-4 prose-ol:m-0"
      remarkPlugins={[remarkGfm]}
      components={{
        h1: "h2",
        a: (props) => {
          const handle = props.href.split("/u/")[1];
          return props.href.startsWith(`${BASE_URL}u/`) ? (
            <UserHandleCard handle={handle}>@{handle}</UserHandleCard>
          ) : (
            <a href={props.href}>{props.children}</a>
          );
        },
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
}

export default Markdown;
