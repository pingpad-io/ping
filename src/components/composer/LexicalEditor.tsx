"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  COMMAND_PRIORITY_LOW,
  KEY_DOWN_COMMAND,
} from "lexical";
import { 
  ListNode,
  ListItemNode
} from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeNode } from "@lexical/code";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { 
  $convertToMarkdownString,
  $convertFromMarkdownString,
  TRANSFORMERS
} from "@lexical/markdown";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import "./lexical.css";
import { EmojiTypeaheadPlugin } from "./EmojiTypeaheadPlugin";

interface LexicalEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onKeyDown?: (event: KeyboardEvent) => void;
  className?: string;
}

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  paragraph: "lexical-paragraph",
  quote: "lexical-quote",
  heading: {
    h1: "lexical-h1",
    h2: "lexical-h2",
    h3: "lexical-h3",
    h4: "lexical-h4",
    h5: "lexical-h5",
    h6: "lexical-h6",
  },
  list: {
    nested: {
      listitem: "lexical-nested-listitem",
    },
    ol: "lexical-list-ol",
    ul: "lexical-list-ul",
    listitem: "lexical-listitem",
  },
  link: "lexical-link",
  text: {
    bold: "lexical-text-bold",
    italic: "lexical-text-italic",
    strikethrough: "lexical-text-strikethrough",
    underline: "lexical-text-underline",
    code: "lexical-text-code",
  },
  code: "lexical-code",
  codeHighlight: {
    atrule: "lexical-code-atrule",
    attr: "lexical-code-attr",
    boolean: "lexical-code-boolean",
    builtin: "lexical-code-builtin",
    cdata: "lexical-code-cdata",
    char: "lexical-code-char",
    class: "lexical-code-class",
    comment: "lexical-code-comment",
    constant: "lexical-code-constant",
    deleted: "lexical-code-deleted",
    doctype: "lexical-code-doctype",
    entity: "lexical-code-entity",
    function: "lexical-code-function",
    important: "lexical-code-important",
    inserted: "lexical-code-inserted",
    keyword: "lexical-code-keyword",
    namespace: "lexical-code-namespace",
    number: "lexical-code-number",
    operator: "lexical-code-operator",
    prolog: "lexical-code-prolog",
    property: "lexical-code-property",
    punctuation: "lexical-code-punctuation",
    regex: "lexical-code-regex",
    selector: "lexical-code-selector",
    string: "lexical-code-string",
    symbol: "lexical-code-symbol",
    tag: "lexical-code-tag",
    url: "lexical-code-url",
    variable: "lexical-code-variable",
  },
};

function onError(error: Error) {
  console.error(error);
}

const PlaceholderPlugin = ({ placeholder }: { placeholder: string }) => {
  return (
    <div className="lexical-placeholder">
      {placeholder}
    </div>
  );
};

const KeyboardShortcutPlugin = ({ onKeyDown }: { onKeyDown?: (event: KeyboardEvent) => void }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
          event.preventDefault();
          if (onKeyDown) {
            onKeyDown(event);
          }
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, onKeyDown]);

  return null;
};

const OnChangePluginWrapper = ({ onChange, value }: { onChange: (value: string) => void; value: string }) => {
  const [editor] = useLexicalComposerContext();
  const lastValueRef = useRef(value);

  useEffect(() => {
    if (value !== lastValueRef.current && value !== undefined) {
      editor.update(() => {
        $convertFromMarkdownString(value, TRANSFORMERS);
      });
      lastValueRef.current = value;
    }
  }, [value, editor]);

  const handleChange = useCallback(() => {
    editor.update(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      if (markdown !== lastValueRef.current) {
        lastValueRef.current = markdown;
        onChange(markdown);
      }
    });
  }, [editor, onChange]);

  return <OnChangePlugin onChange={handleChange} />;
};

function EditorContent({
  value,
  onChange,
  placeholder = "write a new post...",
  disabled = false,
  onKeyDown,
  className = "",
}: LexicalEditorProps) {
  return (
    <>
      <RichTextPlugin
        contentEditable={
          <ContentEditable 
            className={`lexical-editor ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
        placeholder={<PlaceholderPlugin placeholder={placeholder} />}
      />
      <OnChangePluginWrapper onChange={onChange} value={value} />
      <HistoryPlugin />
      <ListPlugin />
      <LinkPlugin />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <KeyboardShortcutPlugin onKeyDown={onKeyDown} />
      <EmojiTypeaheadPlugin />
    </>
  );
}

export const LexicalEditorWrapper = ({
  value,
  onChange,
  placeholder = "write a new post...",
  disabled = false,
  onKeyDown,
  className = "",
}: LexicalEditorProps) => {
  const initialConfig = {
    namespace: "PostComposer",
    theme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      LinkNode,
      AutoLinkNode,
    ],
    editorState: () => {
      if (value) {
        $convertFromMarkdownString(value, TRANSFORMERS);
      }
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorContent
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        onKeyDown={onKeyDown}
        className={className}
      />
    </LexicalComposer>
  );
};