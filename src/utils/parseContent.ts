import { getBaseUrl } from "./getBaseUrl";

class ContentParser {
  private content: string;

  constructor(content: string) {
    this.content = content;
  }

  replaceHandles(): ContentParser {
    if (!this.content) return this;
    const userHandleRegex = /(?<!\/)@[\w^\/]+(?!\/)/g;
    const communityHandleRegex = /(?<!\S)\/\w+(?!\S)/g;
    const BASE_URL = getBaseUrl();
    this.content = this.content
      .replace(userHandleRegex, (match) => {
        const parts = match.slice(1).split("/");
        const handle = parts.length > 1 ? parts[1] : parts[0];
        return `${BASE_URL}u/${handle}`;
      })
      .replace(communityHandleRegex, (match) => `${BASE_URL}c${match}`);
    return this;
  }

  parseLinks(): ContentParser {
    const linkRegex = /<?((?:https?:\/\/|www\.)?[\w-]+(?:\.[\w-]+)*\.[a-zA-Z]{2,}(?:\/[^\s<>*_~`]*)?)>?/gi;
    this.content = this.content.replace(linkRegex, (match, link) => {
      const url = link.startsWith("http") ? link : `https://${link}`;
      const linkWithoutProtocol = link.replace(/^https?:\/\//, "");
      return `[${linkWithoutProtocol}](${url})`;
    });
    return this;
  }

  toString(): string {
    return this.content;
  }
}

export function parseContent(content: string): ContentParser {
  return new ContentParser(content);
}
