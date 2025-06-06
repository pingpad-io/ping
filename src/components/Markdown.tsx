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
const Markdown: React.FC<{ content: string; className?: string }> = ({ content, className = "" }) => {
  const processedText = parseContent(content).replaceHandles().toString();

  // Extract color classes to pass to custom components
  const colorClasses =
    className
      .split(" ")
      .filter((cls) => cls.includes("text-"))
      .join(" ") || "";

  // Create a custom link component with the color classes in closure
  const createCustomLink = (colorClasses: string): Components["a"] => {
    return ({ node, ...props }) => {
      const { href, children } = props;
      if (href?.startsWith(BASE_URL)) {
        if (href.startsWith(`${BASE_URL}u/`)) {
          return (
            <span className={colorClasses}>
              <UserLazyHandle handle={href.split("/u/")[1]} />
            </span>
          );
        }
        if (href.startsWith(`${BASE_URL}c/`)) {
          return (
            <span className={colorClasses}>
              <CommunityHandle handle={href.split("/c/")[1]} />
            </span>
          );
        }
      }
      return (
        <a {...props} className={colorClasses}>
          {children}
        </a>
      );
    };
  };

  return (
    <ReactMarkdown
      className={`prose dark:prose-invert prose-p:my-0 prose-p:inline prose-img:my-2 prose-hr:my-3 prose-hr:w-[50%] prose-hr:mx-auto prose-img:inline
        prose-ul:m-0 prose-h2:m-0 prose-h1:m-0 prose-li:m-0 prose-li:whitespace-normal prose-p:whitespace-normal
        prose-ul:leading-4 prose-ol:leading-4 prose-ol:m-0 ${className}`}
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        h1: "h2",
        a: createCustomLink(colorClasses),
        img: CustomImage,
      }}
    >
      {processedText}
    </ReactMarkdown>
  );
};

const CustomImage: Components["img"] = ({ node, ...props }) => {
  const { src, alt } = props;
  if (!src) return null;
  return <ImageViewer src={src} alt={alt} className="rounded-lg" />;
};

export default Markdown;
