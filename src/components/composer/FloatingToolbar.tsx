"use client";

import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { Bold, Check, Code, Italic, Link, Strikethrough, Underline } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Toggle } from "@/src/components/ui/toggle";

interface FloatingToolbarProps {
  coordinates: { x: number; y: number } | null;
  onModeChange?: (mode: ToolbarMode) => void;
}

export type ToolbarMode = "format" | "link";

export function FloatingToolbar({ coordinates, onModeChange }: FloatingToolbarProps) {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [mode, setMode] = useState<ToolbarMode>("format");
  const [linkUrl, setLinkUrl] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onModeChange?.(mode);
  }, [mode, onModeChange]);

  const updateToolbarState = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        setIsBold(selection.hasFormat("bold"));
        setIsItalic(selection.hasFormat("italic"));
        setIsUnderline(selection.hasFormat("underline"));
        setIsStrikethrough(selection.hasFormat("strikethrough"));
        setIsCode(selection.hasFormat("code"));

        // Check if selection has a link
        const node = selection.anchor.getNode();
        const parent = node.getParent();
        setIsLink(parent?.__type === "link" || node.__type === "link" || parent?.getParent()?.__type === "link");
      }
    });
  }, [editor]);

  useEffect(() => {
    updateToolbarState();
    return editor.registerUpdateListener(() => {
      updateToolbarState();
    });
  }, [editor, updateToolbarState]);

  const formatText = (format: "bold" | "italic" | "underline" | "strikethrough" | "code") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const toggleLink = () => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
      setMode("link");
      setTimeout(() => {
        linkInputRef.current?.focus();
        linkInputRef.current?.select();
      }, 50);
    }
  };

  const insertLink = () => {
    if (linkUrl) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
      setLinkUrl("");
      setMode("format");
    }
  };

  const cancelLink = () => {
    setLinkUrl("");
    setMode("format");
  };

  // Handle click outside or escape
  useEffect(() => {
    if (mode !== "link") return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".lexical-floating-toolbar")) {
        cancelLink();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelLink();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mode]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      insertLink();
    }
  };

  if (!coordinates) return null;

  return createPortal(
    <div
      className="lexical-floating-toolbar"
      style={{
        position: "absolute",
        top: `${coordinates.y}px`,
        left: `${coordinates.x}px`,
        transform: "translate(-50%, -100%)",
      }}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex items-center gap-1 bg-background border border-border rounded-lg shadow-lg p-1">
        {mode === "format" ? (
          <>
            <Toggle size="sm" pressed={isBold} onPressedChange={() => formatText("bold")} aria-label="Bold">
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle size="sm" pressed={isItalic} onPressedChange={() => formatText("italic")} aria-label="Italic">
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={isUnderline}
              onPressedChange={() => formatText("underline")}
              aria-label="Underline"
            >
              <Underline className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={isStrikethrough}
              onPressedChange={() => formatText("strikethrough")}
              aria-label="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Toggle>
            <div className="w-px h-6 bg-border mx-1" />
            <Toggle size="sm" pressed={isCode} onPressedChange={() => formatText("code")} aria-label="Code">
              <Code className="h-4 w-4" />
            </Toggle>
            <Toggle size="sm" pressed={isLink} onPressedChange={toggleLink} aria-label="Link">
              <Link className="h-4 w-4" />
            </Toggle>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              ref={linkInputRef}
              type="url"
              placeholder="Enter URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-9 w-[250px]"
              autoFocus
            />
            <Button onClick={insertLink} size="sm" className="h-9 w-9" aria-label="Insert link">
              <Check className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
