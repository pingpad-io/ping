"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { editPost, fetchPost, post } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { image, MediaImageMimeType, MediaVideoMimeType, textOnly, video } from "@lens-protocol/metadata";
import EmojiPicker, { type Theme } from "emoji-picker-react";
import { ImageIcon, SendHorizontalIcon, SmileIcon, VideoIcon, X, XIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/src/components/ui/form";
import { useAuth } from "~/hooks/useAuth";
import { getLensClient } from "~/utils/lens/getLensClient";
import { storageClient } from "~/utils/lens/storage";
import { getCommunityTags } from "../communities/Community";
import { LexicalEditorWrapper } from "../composer/LexicalEditor";
import { LoadingSpinner } from "../LoadingSpinner";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import type { User } from "../user/User";
import { UserAvatar } from "../user/UserAvatar";
import { useUser } from "../user/UserContext";
import type { Post } from "./Post";
import { lensItemToPost } from "./Post";

interface SortableMediaItemProps {
  file: File;
  index: number;
  id: string;
  onRemove: () => void;
}

const SortableMediaItem = ({ file, index, id, onRemove }: SortableMediaItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isVideo = file.type.startsWith("video/");
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-lg overflow-hidden border ${isDragging ? "opacity-50 z-50" : ""}`}
    >
      <div className="aspect-square relative">
        <div {...attributes} {...listeners} className="absolute inset-0 cursor-move z-10">
          {isVideo ? (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <VideoIcon className="w-8 h-8 text-muted-foreground" />
              <video src={url} className="absolute inset-0 w-full h-full object-fit opacity-50" />
            </div>
          ) : (
            <img src={url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-1 right-1 p-1 bg-black/20 backdrop-blur-sm rounded-full text-white/80 hover:bg-black/40 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-20"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const MediaPreview = ({
  files,
  onRemove,
  onReorder,
}: {
  files: Array<{ file: File; id: string }>;
  onRemove: (id: string) => void;
  onReorder: (from: number, to: number) => void;
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (files.length === 0) return null;

  const fileIds = files.map((f) => f.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fileIds.indexOf(active.id as string);
      const newIndex = fileIds.indexOf(over.id as string);
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={fileIds} strategy={rectSortingStrategy}>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {files.map((item, index) => (
            <SortableMediaItem
              key={item.id}
              id={item.id}
              file={item.file}
              index={index}
              onRemove={() => onRemove(item.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};


export default function PostComposer({
  user,
  replyingTo,
  quotedPost,
  onClose,
  onSuccess,
  initialContent = "",
  editingPost,
  onCancel,
}: {
  user?: User;
  replyingTo?: Post;
  quotedPost?: Post;
  onClose?: () => void;
  onSuccess?: (post?: Post | null) => void;
  initialContent?: string;
  editingPost?: Post;
  onCancel?: () => void;
}) {
  const { user: contextUser } = useUser();
  const { requireAuth } = useAuth();
  const currentUser = user || contextUser;
  const [isPosting, setPosting] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<Array<{ file: File; id: string }>>([]);

  const handleAddFiles = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > 8 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum file size is 8MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const newFiles = validFiles.map((file) => ({
        file,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }));
      setMediaFiles((prev) => [...prev, ...newFiles]);
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleAddFiles(acceptedFiles);
    },
    [handleAddFiles],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
    noClick: true,
    noKeyboard: true,
  });

  const placeholderText = editingPost
    ? "edit your post..."
    : replyingTo
      ? "write your reply..."
      : quotedPost
        ? "add your thoughts..."
        : "write a new post...";
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
      content: editingPost?.metadata?.content || initialContent,
    },
  });
  const watchedContent = form.watch("content");
  const isEmpty = !watchedContent.trim() && mediaFiles.length === 0;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!requireAuth()) {
      return;
    }

    setPosting(true);
    const toastId = Math.random().toString();

    // Only show optimistic post for new posts, not edits
    if (!editingPost) {
      // Create optimistic post
      const optimisticPost: Post = {
        id: `optimistic-${Date.now()}`,
        author: currentUser!,
        metadata: {
          content: data.content, // Keep content for matching later
        },
        createdAt: new Date().toISOString(),
        reactions: {
          Like: 0,
          Repost: 0,
          Comment: 0,
          Quote: 0,
        },
        isOptimistic: true,
      } as any;

      // Call onSuccess with optimistic post
      onSuccess?.(optimisticPost);

      // Clear form immediately after showing optimistic post
      form.setValue("content", "");
      setMediaFiles([]);
    }

    const tags = getCommunityTags(community);
    const client = await getLensClient();

    let metadata: any;
    try {
      const content = data.content.length > 0 ? data.content : undefined;
      // TODO: Mentions are parsed from content by Lens Protocol backend
      // const mentions = content ? extractMentions(content) : undefined;

      if (mediaFiles.length > 0) {
        toast.loading("Uploading media files...", { id: toastId });

        // Upload all media files
        const uploadedFiles = await Promise.all(
          mediaFiles.map(async ({ file }) => {
            const { uri } = await storageClient.uploadFile(file);
            return { uri, type: file.type, file };
          }),
        );

        const primaryFile = uploadedFiles[0];
        const attachments =
          uploadedFiles.length > 1
            ? uploadedFiles.slice(1).map((f) => ({
              item: f.uri,
              type: f.type.startsWith("image/") ? (f.type as MediaImageMimeType) : (f.type as MediaVideoMimeType),
            }))
            : undefined;

        // Check if primary file is video or image
        if (primaryFile.type.startsWith("video/")) {
          metadata = video({
            content,
            tags: tags,
            attachments,
            video: {
              item: primaryFile.uri,
              type: primaryFile.type as MediaVideoMimeType,
            },
          });
        } else {
          metadata = image({
            content,
            tags: tags,
            attachments,
            image: {
              item: primaryFile.uri,
              type: primaryFile.type as MediaImageMimeType,
            },
          });
        }
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
      toast.loading("Uploading...", { id: toastId });

      const metadataFile = new File([JSON.stringify(metadata)], "metadata.json", { type: "application/json" });
      const { uri: contentUri } = await storageClient.uploadFile(metadataFile);

      if (!editingPost) {
        toast.loading("Publishing...", { id: toastId });
      }
      console.log("Uploaded metadata to grove storage:", contentUri);

      if (!client || !client.isSessionClient()) {
        toast.error("Not authenticated", { id: toastId });
        setPosting(false);
        return;
      }

      // const feed = env.NEXT_PUBLIC_FEED_ADDRESS ? env.NEXT_PUBLIC_FEED_ADDRESS : undefined;
      const feed = undefined;

      if (editingPost) {
        const result = await editPost(client, {
          contentUri,
          post: editingPost.id,
        })
          .andThen(handleOperationWith(walletClient))
          .andThen(client.waitForTransaction)
          .andThen((txHash) => fetchPost(client, { txHash }));

        if (result.isOk()) {
          console.log("Edited successfully:", result.value);
          toast.success("Post edited successfully!", { id: toastId });
          onSuccess?.(lensItemToPost(result.value));
        } else {
          console.error("Failed to edit:", result.error);
          toast.error(`Failed to edit: ${String(result.error)}`, { id: toastId });
        }
      } else {
        // Handle creating new post
        const postData = replyingTo
          ? {
            feed,
            contentUri,
            commentOn: {
              post: replyingTo.id,
            },
          }
          : quotedPost
            ? {
              feed,
              contentUri,
              quoteOf: {
                post: quotedPost.id,
              },
            }
            : {
              feed,
              contentUri,
            };

        if (quotedPost) {
          const response = await fetch(`/api/posts/${quotedPost.id}/quote`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: data.content }),
          });

          if (response.ok) {
            toast.success("Quoted successfully!", { id: toastId });
            onSuccess?.(null);
            onClose?.();
          } else {
            const error = await response.json();
            console.error("Failed to create quote:", error);
            toast.error(`Failed to quote: ${error.error || "Unknown error"}`, { id: toastId });
          }
        } else {
          const result = await post(client, postData)
            .andThen(handleOperationWith(walletClient))
            .andThen(client.waitForTransaction)
            .andThen((txHash) => fetchPost(client, { txHash }));

          if (result.isOk()) {
            console.log("Published successfully:", result.value);
            const newPost = lensItemToPost(result.value);
            toast.success("Published successfully!", {
              id: toastId,
              action: {
                label: "Show me",
                onClick: () => newPost && router.push(`/p/${newPost.id}`),
              },
            });
            onSuccess?.(newPost);
          } else {
            console.error("Failed to publish:", result.error);
            toast.error(`Failed to publish: ${String(result.error)}`, { id: toastId });
          }
        }
      }
    } catch (error) {
      console.error("Error publishing:", error);
      toast.error(`Failed to publish: ${error.message}`, { id: toastId });
    } finally {
      setPosting(false);
    }
  }

  const handleEmojiClick = useCallback(
    (emoji: any) => {
      if (!requireAuth()) return;
      const content = form.getValues("content");
      const newContent = content + emoji.emoji;
      form.setValue("content", newContent, { shouldValidate: true });
    },
    [form],
  );

  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const { theme } = useTheme();

  const handleRemoveMedia = useCallback((id: string) => {
    setMediaFiles((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleReorderMedia = useCallback((from: number, to: number) => {
    setMediaFiles((prev) => arrayMove(prev, from, to));
  }, []);

  return (
    <div className="w-full" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive && (
        <div className="absolute inset-0 bg-black/20 z-50 flex items-center justify-center rounded-lg border-2 border-dashed border-primary">
          <p className="text-white text-lg">Drop image to upload</p>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full">
          <div className="flex flex-row gap-2 w-full">
            {currentUser && (
              <div className={`${replyingTo ? "w-8 h-8" : "w-10 h-10"} self-start`}>
                <UserAvatar user={currentUser} link={true} card={false} />
              </div>
            )}
            <div className="grow flex-1">
              <div className="flex items-center justify-between h-5 gap-1 mb-2 pl-2 text-xs sm:text-sm">
                <span className="font-bold">{currentUser?.handle || ""}</span>
                {editingPost && (
                  <div className="ml-auto">
                    <Button
                      type="button"
                      variant="link"
                      onClick={onCancel}
                      disabled={isPosting}
                      className="flex gap-4 w-4 rounded-full hover-expand justify-center [&>span]:hover:scale-110 [&>span]:active:scale-95"
                    >
                      <span className="transition-transform">
                        <XIcon
                          size={18}
                          strokeWidth={2.2}
                          stroke="hsl(var(--muted-foreground))"
                          className="transition-all duration-200"
                        />
                      </span>
                    </Button>
                  </div>
                )}
              </div>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                <FormItem className="relative">
                  <FormControl>
                    <div {...getRootProps()}>
                      <LexicalEditorWrapper
                        value={field.value}
                        onChange={(value) => {
                          if (!requireAuth()) return;
                          field.onChange(value);
                        }}
                        onKeyDown={(e) => {
                          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                            onSubmit(form.getValues());
                          }
                        }}
                        onPasteFiles={handleAddFiles}
                        placeholder={placeholderText}
                        disabled={isPosting}
                        className="rounded-xl"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2 mt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="p-0 m-0 rounded-full w-8 h-8 hover-expand [&>svg]:hover:scale-110 [&>svg]:active:scale-95"
                onClick={open}
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
                    onEmojiClick={handleEmojiClick}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <MediaPreview files={mediaFiles} onRemove={handleRemoveMedia} onReorder={handleReorderMedia} />
            {quotedPost && (
              <div className="mt-2 p-3 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4">
                    <UserAvatar user={quotedPost.author} link={false} card={false} />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {quotedPost.author.name} @{quotedPost.author.handle}
                  </span>
                </div>
                <p className="text-sm line-clamp-3">{quotedPost.metadata?.content || ""}</p>
              </div>
            )}
            {editingPost && (
              <div className="mt-4">
                <Button 
                  disabled={isPosting || isEmpty} 
                  type="submit"
                  className="w-full"
                >
                  {isPosting ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner />
                      <span>Updating...</span>
                    </span>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            )}
            </div>
            {!editingPost && (
              <Button disabled={isPosting || isEmpty} size="icon" type="submit" className="h-8 w-8 self-start">
                {isPosting ? <LoadingSpinner /> : <SendHorizontalIcon className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
