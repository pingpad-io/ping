import { ImageIcon, SmileIcon } from "lucide-react";
import { useState } from "react";
import { EmojiPicker } from "../emoji/EmojiPicker";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface PostComposerActionsProps {
  onImageClick: () => void;
  onEmojiClick: (emoji: any) => void;
}

export function PostComposerActions({ onImageClick, onEmojiClick }: PostComposerActionsProps) {
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-full w-8 h-8 hover:bg-transparent button-hover-bg button-hover-bg-equal"
        onClick={onImageClick}
      >
        <ImageIcon className="h-5 w-5 text-muted-foreground" />
      </Button>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-8 h-8 hover:bg-transparent button-hover-bg button-hover-bg-equal"
            onClick={() => setEmojiPickerOpen(!isEmojiPickerOpen)}
          >
            <SmileIcon className="h-5 w-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
