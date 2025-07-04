import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown/lib/ast-to-react";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { parseContent } from "~/utils/parseContent";
import { CommunityHandle } from "./communities/CommunityHandle";
import { ImageViewer } from "./ImageViewer";
import { UserLazyHandle } from "./user/UserLazyHandle";
import "~/components/composer/lexical.css";

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
            <span className={`lexical-link ${colorClasses}`}>
              <UserLazyHandle handle={href.split("/u/")[1]} />
            </span>
          );
        }
        if (href.startsWith(`${BASE_URL}c/`)) {
          return (
            <span className={`lexical-link ${colorClasses}`}>
              <CommunityHandle handle={href.split("/c/")[1]} />
            </span>
          );
        }
      }
      return (
        <a {...props} className={`lexical-link ${colorClasses}`}>
          {children}
        </a>
      );
    };
  };

  const components: Components = {
    p: ({ children }) => <p className="lexical-paragraph">{children}</p>,
    h1: ({ children }) => <h1 className="lexical-h1">{children}</h1>,
    h2: ({ children }) => <h2 className="lexical-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="lexical-h3">{children}</h3>,
    h4: ({ children }) => <h4 className="lexical-h4">{children}</h4>,
    h5: ({ children }) => <h5 className="lexical-h5">{children}</h5>,
    h6: ({ children }) => <h6 className="lexical-h6">{children}</h6>,
    strong: ({ children }) => <strong className="lexical-text-bold">{children}</strong>,
    em: ({ children }) => <em className="lexical-text-italic">{children}</em>,
    del: ({ children }) => <del className="lexical-text-strikethrough">{children}</del>,
    code: ({ children }) => <code className="lexical-text-code">{children}</code>,
    pre: ({ children }) => <pre className="lexical-code">{children}</pre>,
    blockquote: ({ children }) => <blockquote className="lexical-quote">{children}</blockquote>,
    ul: ({ children }) => <ul className="lexical-list-ul">{children}</ul>,
    ol: ({ children }) => <ol className="lexical-list-ol">{children}</ol>,
    li: ({ children }) => <li className="lexical-listitem">{children}</li>,
    a: createCustomLink(colorClasses),
    img: CustomImage,
  };

  return (
    <ReactMarkdown className={`${className}`} remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
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
