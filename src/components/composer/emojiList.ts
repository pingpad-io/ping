import data from "emojibase-data/en/data.json";
import shortcodes from "emojibase-data/en/shortcodes/github.json";

export interface EmojiData {
  emoji: string;
  names: string[];
  keywords: string[];
}

const shortcodeMap = new Map<string, string[]>();
for (const [hexcode, codes] of Object.entries(shortcodes)) {
  const codeArray = Array.isArray(codes) ? codes : [codes];
  shortcodeMap.set(hexcode, codeArray as string[]);
}

export const emojiList: EmojiData[] = data
  .filter((item) => {
    return item.emoji && item.type === 1 && item.tags && item.tags.length > 0 && !item.tone;
  })
  .map((item) => {
    const names: string[] = [];

    const codes = shortcodeMap.get(item.hexcode);
    if (codes && codes.length > 0) {
      names.push(...codes);
    }

    if (item.label) {
      const labelName = item.label.toLowerCase().replace(/[:\s]+/g, "_");
      if (!names.includes(labelName)) {
        names.push(labelName);
      }
    }

    const keywords = [...(item.tags || [])];
    if (item.label && !keywords.includes(item.label.toLowerCase())) {
      keywords.push(item.label.toLowerCase());
    }

    return {
      emoji: item.emoji,
      names: names.length > 0 ? names : ["emoji"],
      keywords,
    };
  })
  .filter((item) => item.names.length > 0);
