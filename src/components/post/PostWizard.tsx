"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { fetchPost, post } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { image, MediaImageMimeType, textOnly } from "@lens-protocol/metadata";
import { useAccounts } from "@lens-protocol/react";
import EmojiPicker, { type Theme } from "emoji-picker-react";
import { ImageIcon, SendHorizontalIcon, SmileIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/src/components/ui/form";
import { getLensClient } from "~/utils/lens/getLensClient";
import { storageClient } from "~/utils/lens/storage";
import { getCommunityTags } from "../communities/Community";
import { LoadingSpinner } from "../LoadingSpinner";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Textarea } from "../ui/textarea";
import type { User } from "../user/User";
import { lensAcountToUser } from "../user/User";
import { UserAvatar } from "../user/UserAvatar";
import type { Post } from "./Post";
import { lensItemToPost } from "./Post";

const UserSearchPopup = ({ query, onSelectUser, onClose, position }) => {
  const { data: profiles, loading, error } = useAccounts({ filter: { searchBy: { localNameQuery: query.slice(1) } } });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const users = profiles?.items?.slice(0, 10).map(lensAcountToUser) || [];

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
      {error && <p className="p-2 text-center">Error: {error}</p>}
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

export default function PostWizard({
  user,
  replyingTo,
  onSuccess,
}: {
  user?: User;
  replyingTo?: Post;
  onSuccess?: (post?: Post | null) => void;
}) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPosting, setPosting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const placeholderText = replyingTo ? "write your reply..." : "write a new post...";
  const pathname = usePathname().split("/");
  const community = pathname[1] === "c" ? pathname[2] : "";
  const router = useRouter();

  const { data: walletClient } = useWalletClient();

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
  const watchedContent = form.watch("content");
  const isEmpty = !watchedContent.trim() && !imageFile;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setPosting(true);
    const toastId = Math.random().toString();

    const tags = getCommunityTags(community);
    const client = await getLensClient();

    let metadata: any;
    try {
      const content = data.content.length > 0 ? data.content : undefined;

      if (imageFile) {
        toast.loading("Uploading image...", { id: toastId });
        const { uri } = await storageClient.uploadFile(imageFile);
        metadata = image({
          content,
          tags: tags,
          image: {
            item: uri,
            type: imageFile.type as MediaImageMimeType,
          },
        });
      } else {
        metadata = textOnly({
          content,
          tags: tags,
        });
      }
    } catch (error) {
      toast.error(error.message);
      setPosting(false);
      return;
    }

    try {
      toast.loading("Uploading metadata...", { id: toastId });

      const metadataFile = new File([JSON.stringify(metadata)], "metadata.json", { type: "application/json" });
      const { uri: contentUri } = await storageClient.uploadFile(metadataFile);

      toast.loading("Creating post on Lens...", { id: toastId });
      console.log("Uploaded metadata to grove storage:", contentUri);

      if (!client || !client.isSessionClient()) {
        toast.error("Not authenticated", { id: toastId });
        setPosting(false);
        return;
      }

      // const feed = env.NEXT_PUBLIC_FEED_ADDRESS ? env.NEXT_PUBLIC_FEED_ADDRESS : undefined;
      const feed = undefined;

      const postData = replyingTo
        ? {
            feed,
            contentUri,
            commentOn: {
              post: replyingTo.id,
            },
          }
        : {
            feed,
            contentUri,
          };

      const result = await post(client, postData)
        .andThen(handleOperationWith(walletClient))
        .andThen(client.waitForTransaction)
        .andThen((txHash) => fetchPost(client, { txHash }));

      if (result.isOk()) {
        console.log("Post created successfully:", result.value);
        const newPost = lensItemToPost(result.value);
        toast.success("Post published successfully!", {
          id: toastId,
          action: {
            label: "Show me",
            onClick: () => newPost && router.push(`/p/${newPost.id}`),
          },
        });
        form.setValue("content", "");
        resetHeight();
        setImageFile(null);
        onSuccess?.(newPost);
      } else {
        console.error("Failed to create post:", result.error);
        toast.error(`Failed to publish: ${String(result.error)}`, { id: toastId });
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(`Failed to create post: ${error.message}`, { id: toastId });
    } finally {
      setPosting(false);
    }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
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
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
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
                    autoComplete="off"
                    className="min-h-8 resize-none px-2 py-2"
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
                <input ref={fileInputRef} onChange={handleFileChange} type="file" accept="image/*" className="hidden" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-0 m-0 rounded-full w-8 h-8 absolute right-[35px] bottom-[3px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-5 w-5 text-base-content" />
                </Button>
                {showPopup && (
                  <UserSearchPopup
                    query={searchQuery}
                    onSelectUser={handleSelectUser}
                    onClose={() => setShowPopup(false)}
                    position={popupPosition}
                  />
                )}
                {imageFile && (
                  <div className="mt-2">
                    <img src={URL.createObjectURL(imageFile)} alt="selected" className="max-h-40 rounded-md" />
                  </div>
                )}
              </FormItem>
            )}
          />
          {!isEmpty && (
            <Button disabled={isPosting} size="icon" type="submit" className="h-10 w-10">
              {isPosting ? <LoadingSpinner /> : <SendHorizontalIcon />}
            </Button>
          )}
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
