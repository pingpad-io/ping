import { getBaseUrl } from "./getBaseUrl";

class ContentParser {
  private content: string;

  constructor(content: string) {
    this.content = content;
  }

  replaceHandles(): ContentParser {
    if (!this.content) return this;
    const lensHandleRegex = /@lens\/(\w+)/g;
    const userHandleRegex = /(?<![[/])@[\w]+(?![\]/])/g;
    const communityHandleRegex = /(?<!\S)\/\w+(?!\S)/g;
    const BASE_URL = getBaseUrl();
    this.content = this.content
      .replace(lensHandleRegex, (match, handle) => {
        return `[${match}](${BASE_URL}u/${handle})`;
      })
      .replace(userHandleRegex, (match) => {
        const handle = match.slice(1);
        return `[${match}](${BASE_URL}u/${handle})`;
      })
      .replace(communityHandleRegex, (match) => `[${match}](${BASE_URL}c${match})`);
    return this;
  }

  parseLinks(): ContentParser {
    const linkRegex = /<?((?:https?:\/\/|www\.)?[\w-]+(?:\.[\w-]+)*\.[a-zA-Z]{2,}(?:\/[^\s<>*_~`]*)?)>?/gi;
    this.content = this.content.replace(linkRegex, (match, link) => {
      const url = link.startsWith("http") ? link : `https://${link}`;

      // Skip image URLs
      const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(url) || url.includes("api.grove.storage");
      if (isImage) {
        return match;
      }

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
