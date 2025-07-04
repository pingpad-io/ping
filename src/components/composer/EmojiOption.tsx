import { MenuOption } from "@lexical/react/LexicalTypeaheadMenuPlugin";

export class EmojiOption extends MenuOption {
  emoji: string;
  names: string[];
  keywords: string[];

  constructor(emoji: string, names: string[], keywords: string[]) {
    super(names[0]);
    this.emoji = emoji;
    this.names = names;
    this.keywords = keywords;
  }
}

interface EmojiMenuItemProps {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: EmojiOption;
}

export function EmojiMenuItem({ index, isSelected, onClick, onMouseEnter, option }: EmojiMenuItemProps) {
  const getBestName = () => {
    const descriptiveNames = option.names.filter((name) => name.length > 2);
    const namesToUse = descriptiveNames.length > 0 ? descriptiveNames : option.names;

    return namesToUse.reduce((longest, name) => (name.length > longest.length ? name : longest), namesToUse[0]);
  };

  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={`
        flex items-center gap-2 px-3 py-1 cursor-pointer rounded-md transition-colors text-sm
        ${isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}
      `}
      ref={option.setRefElement}
      aria-selected={isSelected}
      id={`typeahead-item-${index}`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <span className="text-xl w-6 text-center">{option.emoji}</span>
      <span className="flex-1 opacity-80">:{getBestName()}:</span>
    </li>
  );
}
