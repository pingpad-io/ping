"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import {
  $getSelection,
  $isRangeSelection,
  TextNode,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { emojiList } from "./emojiList";
import { EmojiOption, EmojiMenuItem } from "./EmojiOption";
import ReactDOM from "react-dom";

const MAX_EMOJI_SUGGESTIONS = 10;

function useEmojiLookup() {
  const [queryString, setQueryString] = useState<string | null>(null);

  const emojiOptions = useMemo(() => {
    return emojiList.map(
      ({ emoji, names, keywords }) => new EmojiOption(emoji, names, keywords)
    );
  }, []);

  const options = useMemo(() => {
    if (!queryString) {
      return [];
    }

    const query = queryString.toLowerCase();

    const filtered = emojiOptions.filter((option) => {
      return (
        option.names.some((name) => name.toLowerCase().includes(query)) ||
        option.keywords.some((keyword) => keyword.toLowerCase().includes(query))
      );
    });

    return filtered.slice(0, MAX_EMOJI_SUGGESTIONS);
  }, [emojiOptions, queryString]);

  const onSelectOption = useCallback(
    (
      selectedOption: MenuOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
    ) => {
      const editor = (window as any).lexicalEditor;
      if (!editor || !nodeToRemove) return;

      editor.update(() => {
        const emojiOption = selectedOption as EmojiOption;
        const selection = $getSelection();

        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          return;
        }

        nodeToRemove.remove();
        selection.insertRawText(emojiOption.emoji);
        closeMenu();
      });
    },
    [],
  );

  return {
    queryString,
    setQueryString,
    options,
    onSelectOption,
  };
}

export function EmojiTypeaheadPlugin() {
  const [editor] = useLexicalComposerContext();
  const { setQueryString, options, onSelectOption } = useEmojiLookup();

  useEffect(() => {
    (window as any).lexicalEditor = editor;
    return () => {
      delete (window as any).lexicalEditor;
    };
  }, [editor]);

  const checkForTriggerMatch = useCallback(
    (text: string) => {
      const match = text.match(/:([a-zA-Z0-9_+\-]*)$/);
      if (match) {
        const query = match[1];
        if (query.length >= 1) {
          return {
            leadOffset: match.index || 0,
            matchingString: query,
            replaceableString: match[0],
          };
        }
      }
      return null;
    },
    []
  );

  return (
    <LexicalTypeaheadMenuPlugin<EmojiOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) => {
        if (!anchorElementRef.current || options.length === 0) {
          return null;
        }

        const editorElement = editor.getRootElement();
        const editorContainer = editorElement?.closest('.lexical-editor');
        const containerRect = editorContainer?.getBoundingClientRect();
        const anchorRect = anchorElementRef.current.getBoundingClientRect();

        // Use editor container bottom if available, otherwise fall back to anchor
        const editorRect = editorElement?.getBoundingClientRect();
        const topPosition = editorRect ? editorRect.bottom : anchorRect.bottom - 12;

        const style: React.CSSProperties = {
          position: 'fixed',
          top: topPosition,
          left: containerRect?.left || anchorRect.left,
          width: containerRect?.width || 'auto',
        };

        return ReactDOM.createPortal(
          <div
            className="rounded-lg shadow-lg z-[100] bg-card/40 backdrop-blur-md border border-border"
            style={style}
          >
            <ul className="list-none m-0 p-0.5 flex flex-col gap-0.5">
              {options.map((option, index) => (
                <EmojiMenuItem
                  key={option.key}
                  index={index}
                  isSelected={selectedIndex === index}
                  onClick={() => {
                    setHighlightedIndex(index);
                    selectOptionAndCleanUp(option);
                  }}
                  onMouseEnter={() => {
                    setHighlightedIndex(index);
                  }}
                  option={option}
                />
              ))}
            </ul>
          </div>,
          document.body
        );
      }}
    />
  );
}