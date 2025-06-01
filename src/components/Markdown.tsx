import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown/lib/ast-to-react";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { parseContent } from "~/utils/parseContent";
import { ImageViewer } from "./ImageViewer";
import { CommunityHandle } from "./communities/CommunityHandle";
import { UserLazyHandle } from "./user/UserLazyHandle";

const BASE_URL = getBaseUrl();
const Markdown: React.FC<{ content: string }> = ({ content }) => {
  const processedText = parseContent(content).replaceHandles().parseLinks().parseImages().toString();
  return (
    <ReactMarkdown
      className="prose dark:prose-invert prose-p:m-0 prose-p:inline
        prose-ul:m-0 prose-h2:m-0 prose-h1:m-0 prose-li:m-0 prose-li:whitespace-normal prose-p:whitespace-normal
        prose-ul:leading-4 prose-ol:leading-4 prose-ol:m-0"
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        h1: "h2",
        a: CustomLink,
        img: CustomImage,
      }}
    >
      {processedText}
    </ReactMarkdown>
  );
};

const CustomLink: Components["a"] = ({ node, ...props }) => {
  const { href, children } = props;
  if (href?.startsWith(BASE_URL)) {
    if (href.startsWith(`${BASE_URL}u/`)) {
      return <UserLazyHandle handle={href.split("/u/")[1]} />;
    }
    if (href.startsWith(`${BASE_URL}c/`)) {
      return <CommunityHandle handle={href.split("/c/")[1]} />;
    }
  }
  return <a {...props}>{children}</a>;
};

const CustomImage: Components["img"] = ({ node, ...props }) => {
  const { src, alt } = props;
  if (!src) return null;
  return <ImageViewer src={src} alt={alt} className="rounded-lg" />;
};

export default Markdown;
