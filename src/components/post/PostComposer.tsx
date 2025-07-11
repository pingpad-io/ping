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
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizontalIcon, VideoIcon, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/src/components/ui/form";
import { useAuth } from "~/hooks/useAuth";
import { LexicalEditorWrapper } from "../composer/LexicalEditor";
import { LoadingSpinner } from "../LoadingSpinner";
import { Button } from "../ui/button";
import type { User } from "../user/User";
import { UserAvatar } from "../user/UserAvatar";
import { useUser } from "../user/UserContext";
import type { Post } from "./Post";
import { useMediaProcessing, type MediaItem } from "~/hooks/useMediaProcessing";
import { usePostSubmission, MAX_CONTENT_LENGTH } from "~/hooks/usePostSubmission";
import { PostComposerHeader } from "./PostComposerHeader";
import { PostComposerActions } from "./PostComposerActions";
import { QuotedPostPreview } from "./QuotedPostPreview";

interface SortableMediaItemProps {
  item: MediaItem;
  index: number;
  onRemove: () => void;
}

const SortableMediaItem = ({ item, index, onRemove }: SortableMediaItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isVideo = item.type === 'file' 
    ? item.file.type.startsWith("video/")
    : item.mimeType.startsWith("video/");
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (item.type === 'file') {
      const objectUrl = URL.createObjectURL(item.file);
      setUrl(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setUrl(item.url);
    }
  }, [item]);

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
  files: MediaItem[];
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
              item={item}
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
  feed,
}: {
  user?: User;
  replyingTo?: Post;
  quotedPost?: Post;
  onClose?: () => void;
  onSuccess?: (post?: Post | null) => void;
  initialContent?: string;
  editingPost?: Post;
  onCancel?: () => void;
  feed?: string;
}) {
  const { user: contextUser } = useUser();
  const { requireAuth } = useAuth();
  const currentUser = user || contextUser;
  
  const {
    mediaFiles,
    setMediaFiles,
    loadExistingMedia,
    handleAddFiles,
    removeMedia,
    reorderMedia,
    processMediaForSubmission,
    clearMedia
  } = useMediaProcessing();

  const { isPosting, submitPost } = usePostSubmission();
  
  const pathname = usePathname().split("/");
  const community = pathname[1] === "c" ? pathname[2] : "";

  // Initialize media from existing post
  useEffect(() => {
    if (editingPost) {
      const existingMedia = loadExistingMedia(editingPost);
      setMediaFiles(existingMedia);
    }
  }, [editingPost, loadExistingMedia, setMediaFiles]);


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

  const FormSchema = z.object({
    content: z.string().max(MAX_CONTENT_LENGTH, {
      message: `Post must not be longer than ${MAX_CONTENT_LENGTH} characters.`,
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

    await submitPost({
      content: data.content,
      mediaFiles,
      processMediaForSubmission,
      editingPost,
      replyingTo,
      quotedPost,
      currentUser,
      community,
      feed,
      onSuccess,
      onClose,
      clearForm: () => {
        form.setValue("content", "");
        clearMedia();
      }
    });
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


  const handleRemoveMedia = removeMedia;
  const handleReorderMedia = reorderMedia;

  return (
    <div className="w-full" {...getRootProps()} onClick={(e) => e.stopPropagation()}>
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
              <PostComposerHeader
                currentUser={currentUser}
                editingPost={editingPost}
                replyingTo={replyingTo}
                onCancel={onCancel}
                isPosting={isPosting}
              />
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

              <PostComposerActions
                onImageClick={open}
                onEmojiClick={handleEmojiClick}
              />

              <MediaPreview files={mediaFiles} onRemove={handleRemoveMedia} onReorder={handleReorderMedia} />
              {quotedPost && <QuotedPostPreview quotedPost={quotedPost} />}
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
