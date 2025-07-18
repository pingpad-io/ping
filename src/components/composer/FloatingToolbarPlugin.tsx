"use client";

import { computePosition, flip, offset, shift } from "@floating-ui/dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { FloatingToolbar, type ToolbarMode } from "./FloatingToolbar";

export function FloatingToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [coordinates, setCoordinates] = useState<{ x: number; y: number } | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const modeRef = useRef<ToolbarMode>("format");

  const updateToolbarPosition = useCallback(() => {
    // Don't update position if we're in link mode
    if (modeRef.current === "link") {
      return;
    }
    editor.getEditorState().read(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection) || selection.isCollapsed()) {
        setCoordinates(null);
        return;
      }

      const nativeSelection = window.getSelection();
      if (!nativeSelection || nativeSelection.rangeCount === 0) {
        setCoordinates(null);
        return;
      }

      const range = nativeSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) {
        setCoordinates(null);
        return;
      }

      const virtualEl = {
        getBoundingClientRect: () => ({
          width: 0,
          height: 0,
          x: rect.x + rect.width / 2,
          y: rect.y,
          top: rect.top,
          left: rect.left + rect.width / 2,
          bottom: rect.bottom,
          right: rect.right,
        }),
      };

      computePosition(virtualEl as any, toolbarRef.current || document.createElement("div"), {
        placement: "top",
        middleware: [
          offset(10),
          flip({
            fallbackPlacements: ["bottom", "top-start", "top-end", "bottom-start", "bottom-end"],
          }),
          shift({ padding: 10 }),
        ],
      }).then(({ x, y }) => {
        setCoordinates({ x, y });
      });
    });
  }, [editor]);

  useEffect(() => {
    const handleSelectionChange = () => {
      updateToolbarPosition();
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    const unregisterListener = editor.registerUpdateListener(() => {
      updateToolbarPosition();
    });

    const handlePointerUp = () => {
      setTimeout(updateToolbarPosition, 0);
    };

    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("pointerup", handlePointerUp);
      unregisterListener();
    };
  }, [editor, updateToolbarPosition]);

  return (
    <FloatingToolbar
      coordinates={coordinates}
      onModeChange={(mode) => {
        modeRef.current = mode;
      }}
    />
  );
}
