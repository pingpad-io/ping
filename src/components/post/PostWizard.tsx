"use client";

import { Form, FormControl, FormField, FormItem } from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { textOnly } from "@lens-protocol/metadata";
import { useSearchProfiles } from "@lens-protocol/react-web";
import EmojiPicker, { type Theme } from "emoji-picker-react";
import { SendHorizontalIcon, SmileIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { LoadingSpinner } from "../LoadingSpinner";
import { getCommunityTags } from "../communities/Community";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Textarea } from "../ui/textarea";
import type { User } from "../user/User";
import { lensProfileToUser } from "../user/User";
import { UserAvatar } from "../user/UserAvatar";
import type { Post } from "./Post";

const UserSearchPopup = ({ query, onSelectUser, onClose, position }) => {
  const { data: profiles, loading, error } = useSearchProfiles({ query: query.slice(1) });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const users = profiles?.slice(0, 10).map(lensProfileToUser) || [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : users.length - 1));
        } else {
          setSelectedIndex((prev) => (prev < users.length - 1 ? prev + 1 : 0));
        }
      } else if (e.key === "Enter" && users[selectedIndex]) {
        e.preventDefault();
        e.stopPropagation();
        onSelectUser(users[selectedIndex]);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [users, selectedIndex, onSelectUser, onClose]);

  return (
    <Card
      className="absolute z-30 w-56 mt-1 hover:bg-card shadow-lg max-h-96 overflow-y-auto flex flex-col gap-1"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      {loading && <p className="p-2 text-center">Loading...</p>}
      {error && <p className="p-2 text-center">Error: {error.message}</p>}
      {!loading && !error && users.length === 0 && <p className="p-2 text-center">No users found</p>}
      {users.map((user, index) => (
        <Card
          key={user.id}
          onClick={() => {
            onSelectUser(user);
            onClose();
          }}
          className={`flex items-center p-2 h-min cursor-pointer ${index === selectedIndex ? "bg-accent" : ""}`}
        >
          <div className="w-8 h-8 mr-2">
            <UserAvatar user={user} link={false} card={true} />
          </div>
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm">@{user.handle}</p>
          </div>
        </Card>
      ))}
    </Card>
  );
};

export default function PostWizard({ user, replyingTo }: { user?: User; replyingTo?: Post }) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [isPosting, setPosting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const placeholderText = replyingTo ? "write your reply..." : "write a new post...";
  const pathname = usePathname().split("/");
  const community = pathname[1] === "c" ? pathname[2] : "";

  const FormSchema = z.object({
    content: z.string().max(3000, {
      message: "Post must not be longer than 3000 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setPosting(true);

    const tags = getCommunityTags(community);

    let metadata;
    try {
      metadata = textOnly({
        content: data.content,
        appId: "ping",
        tags: tags,
      });
    } catch (error) {
      toast.error(error.message);
      setPosting(false);
      return;
    }

    fetch(`/api/posts?${replyingTo ? `replyingTo=${replyingTo.id}&` : ""}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    }).then((res) => {
      if (res.ok) {
        toast.success("Post created successfully!");
        form.setValue("content", "");
        resetHeight();
      } else {
        toast.error(res.statusText);
      }
      setPosting(false);
    });
  }

  const resetHeight = () => {
    if (textarea.current) {
      textarea.current.style.height = "auto";
      textarea.current.style.height = "38px";
    }
  };

  const updateHeight = () => {
    if (textarea.current) {
      textarea.current.style.height = "auto";
      textarea.current.style.height = `${textarea.current.scrollHeight + 2}px`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    form.setValue("content", value);
    updateHeight();

    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const words = textBeforeCursor.split(/\s/);
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith("@") && lastWord.length > 1) {
      setSearchQuery(lastWord);
      setShowPopup(true);
      updatePopupPosition();
    } else {
      setShowPopup(false);
    }
  };

  const updatePopupPosition = () => {
    if (textarea.current) {
      const { selectionStart, selectionEnd } = textarea.current;
      if (selectionStart === selectionEnd) {
        const { top, left } = getCaretCoordinates(textarea.current, selectionStart);
        const { offsetTop, offsetLeft } = textarea.current;
        setPopupPosition({
          top: offsetTop + top + 20,
          left: offsetLeft + left,
        });
      }
    }
  };

  const handleSelectUser = useCallback(
    (selectedUser: User) => {
      const content = form.getValues("content");
      const cursorPosition = textarea.current?.selectionStart || 0;
      const textBeforeCursor = content.slice(0, cursorPosition);
      const textAfterCursor = content.slice(cursorPosition);

      const words = textBeforeCursor.split(/(\s+)/);
      words[words.length - 1] = `@lens/${selectedUser.handle} `;

      const newContent = words.join("") + textAfterCursor;
      form.setValue("content", newContent);
      setShowPopup(false);
      textarea.current?.focus();

      // Set cursor position after the inserted handle
      const newCursorPosition = newContent.length - textAfterCursor.length;
      setTimeout(() => {
        textarea.current?.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    },
    [form],
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey && event.key === "Enter") {
      onSubmit(form.getValues());
    }
    if (event.key === "Tab" && showPopup) {
      event.preventDefault();
    }
  };

  const handleEmojiClick = useCallback(
    (emoji) => {
      const { content } = form.getValues();
      const cursorPosition = textarea.current.selectionStart;
      const textBeforeCursor = content.slice(0, cursorPosition);
      const textAfterCursor = content.slice(cursorPosition);
      const newContent = textBeforeCursor + emoji.emoji + textAfterCursor;

      form.setValue("content", newContent, { shouldValidate: true });

      // Update cursor position
      setTimeout(() => {
        const newCursorPosition = cursorPosition + emoji.emoji.length;
        textarea.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    },
    [form],
  );

  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row gap-2 w-full h-fit place-items-end justify-center"
        >
          {user && (
            <div className="w-10 h-10">
              <UserAvatar user={user} link={true} card={false} />
            </div>
          )}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="grow relative">
                <FormControl>
                  <Textarea
                    {...field}
                    onChange={handleInputChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholderText}
                    disabled={isPosting}
                    className="min-h-8 resize-none mt-2 px-2 py-2"
                    ref={textarea}
                    rows={1}
                  />
                </FormControl>

                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className="absolute right-[3px] bottom-[3px]" asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 m-0 rounded-full w-8 h-8"
                      onClick={() => setEmojiPickerOpen(!isEmojiPickerOpen)}
                    >
                      <SmileIcon className="h-5 w-5 text-base-content" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <EmojiPicker
                      theme={theme as Theme}
                      className="bg-card text-card-foreground"
                      onEmojiClick={handleEmojiClick}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
                {showPopup && (
                  <UserSearchPopup
                    query={searchQuery}
                    onSelectUser={handleSelectUser}
                    onClose={() => setShowPopup(false)}
                    position={popupPosition}
                  />
                )}
              </FormItem>
            )}
          />
          <Button disabled={isPosting} size="icon" type="submit" className="h-10 w-10">
            {isPosting ? <LoadingSpinner /> : <SendHorizontalIcon />}
          </Button>
        </form>
      </Form>
    </div>
  );
}

function getCaretCoordinates(element: HTMLTextAreaElement, position: number) {
  const div = document.createElement("div");
  const styles = getComputedStyle(element);
  const essentialProperties = [
    "fontFamily",
    "fontSize",
    "fontWeight",
    "wordSpacing",
    "letterSpacing",
    "paddingLeft",
    "paddingTop",
    "borderLeftWidth",
    "borderTopWidth",
    "boxSizing",
    "lineHeight",
  ];

  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.whiteSpace = "pre-wrap";
  div.style.width = `${element.offsetWidth}px`;

  for (const prop of essentialProperties) {
    div.style[prop] = styles[prop];
  }

  div.textContent = element.value.substring(0, position);
  const span = document.createElement("span");
  span.textContent = element.value.substring(position) || ".";
  div.appendChild(span);

  document.body.appendChild(div);
  const coordinates = {
    top: span.offsetTop + Number.parseInt(styles.borderTopWidth),
    left: span.offsetLeft + Number.parseInt(styles.borderLeftWidth),
  };
  document.body.removeChild(div);

  return coordinates;
}
