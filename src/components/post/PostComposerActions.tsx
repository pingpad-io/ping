import EmojiPicker, { type Theme } from "emoji-picker-react";
import { ImageIcon, SmileIcon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface PostComposerActionsProps {
  onImageClick: () => void;
  onEmojiClick: (emoji: any) => void;
}

export function PostComposerActions({
  onImageClick,
  onEmojiClick
}: PostComposerActionsProps) {
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="p-0 m-0 rounded-full w-8 h-8 hover-expand [&>svg]:hover:scale-110 [&>svg]:active:scale-95"
        onClick={onImageClick}
      >
        <ImageIcon className="h-5 w-5 text-muted-foreground transition-transform" />
      </Button>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="p-0 m-0 rounded-full w-8 h-8 hover-expand [&>svg]:hover:scale-110 [&>svg]:active:scale-95"
            onClick={() => setEmojiPickerOpen(!isEmojiPickerOpen)}
          >
            <SmileIcon className="h-5 w-5 text-muted-foreground transition-transform" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <EmojiPicker
            theme={theme as Theme}
            className="bg-card text-card-foreground"
            onEmojiClick={onEmojiClick}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}