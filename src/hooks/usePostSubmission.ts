import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";
import { editPost, fetchPost, post } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { image, textOnly, video } from "@lens-protocol/metadata";
import { getLensClient } from "~/utils/lens/getLensClient";
import { storageClient } from "~/utils/lens/storage";
import { castToMediaImageType, castToMediaVideoType } from "~/utils/mimeTypes";
import { getCommunityTags } from "~/components/communities/Community";
import type { Post } from "~/components/post/Post";
import { lensItemToPost } from "~/components/post/Post";
import type { User } from "~/components/user/User";
import type { MediaItem } from "~/hooks/useMediaProcessing";

// Constants
export const MAX_CONTENT_LENGTH = 3000;

interface MediaProcessingResult {
  primaryMedia: { uri: string; type: string } | null;
  attachments: Array<{ item: string; type: any }> | undefined;
}

interface SubmissionOptions {
  content: string;
  mediaFiles: MediaItem[];
  processMediaForSubmission: (toastId?: string) => Promise<MediaProcessingResult>;
  editingPost?: Post;
  replyingTo?: Post;
  quotedPost?: Post;
  currentUser?: User;
  community?: string;
  onSuccess?: (post?: Post | null) => void;
  onClose?: () => void;
  clearForm: () => void;
}

export function usePostSubmission() {
  const [isPosting, setPosting] = useState(false);
  const router = useRouter();
  const { data: walletClient } = useWalletClient();

  const submitPost = useCallback(async ({
    content,
    mediaFiles,
    processMediaForSubmission,
    editingPost,
    replyingTo,
    quotedPost,
    currentUser,
    community = "",
    onSuccess,
    onClose,
    clearForm
  }: SubmissionOptions) => {
    setPosting(true);
    const toastId = Math.random().toString();

    // Only show optimistic post for new posts (not edits or quotes)
    if (!editingPost && !quotedPost && currentUser) {
      // Create optimistic post
      const optimisticPost: Post = {
        id: `optimistic-${Date.now()}`,
        author: currentUser,
        metadata: {
          content: content, // Keep content for matching later
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
      clearForm();
    }

    const tags = getCommunityTags(community);
    const client = await getLensClient();

    let metadata: ReturnType<typeof image> | ReturnType<typeof video> | ReturnType<typeof textOnly>;
    try {
      const postContent = content.length > 0 ? content : undefined;

      if (mediaFiles.length > 0) {
        const { primaryMedia, attachments } = await processMediaForSubmission(toastId);

        if (primaryMedia) {
          if (primaryMedia.type.startsWith("video/")) {
            metadata = video({
              content: postContent,
              tags: tags,
              attachments,
              video: {
                item: primaryMedia.uri,
                type: castToMediaVideoType(primaryMedia.type),
              },
            });
          } else {
            metadata = image({
              content: postContent,
              tags: tags,
              attachments,
              image: {
                item: primaryMedia.uri,
                type: castToMediaImageType(primaryMedia.type),
              },
            });
          }
        } else if (attachments && attachments.length > 0) {
          // If there's no primary media but there are attachments, 
          // we need to promote the first attachment to primary
          const firstAttachment = attachments[0];
          const remainingAttachments = attachments.slice(1);
          metadata = image({
            content: postContent,
            tags: tags,
            attachments: remainingAttachments.length > 0 ? remainingAttachments : undefined,
            image: {
              item: firstAttachment.item,
              type: firstAttachment.type,
            },
          });
        } else {
          metadata = textOnly({
            content: postContent,
            tags: tags,
          });
        }
      } else {
        metadata = textOnly({
          content: postContent,
          tags: tags,
        });
      }
    } catch (error: any) {
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
            body: JSON.stringify({ content }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.result) {
              const txResult = await handleOperationWith(walletClient)(data.result);
              
              if (txResult.isOk()) {
                await client.waitForTransaction(txResult.value);
                const postResult = await fetchPost(client, { txHash: txResult.value });
                
                if (postResult.isOk()) {
                  const newPost = lensItemToPost(postResult.value);
                  toast.success("Quoted successfully!", {
                    id: toastId,
                    action: {
                      label: "Show me",
                      onClick: () => newPost && router.push(`/p/${newPost.id}`),
                    },
                  });
                  onSuccess?.(newPost);
                  onClose?.();
                } else {
                  console.error("Failed to fetch quote post:", postResult.error);
                  toast.error("Quote created but failed to fetch post", { id: toastId });
                  onClose?.();
                }
              } else {
                console.error("Failed to handle quote transaction:", txResult.error);
                toast.error(`Failed to quote: ${String(txResult.error)}`, { id: toastId });
              }
            } else {
              toast.success("Quoted successfully!", { id: toastId });
              onClose?.();
            }
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
    } catch (error: any) {
      console.error("Error publishing:", error);
      toast.error(`Failed to publish: ${error.message}`, { id: toastId });
    } finally {
      setPosting(false);
    }
  }, [router, walletClient]);

  return {
    isPosting,
    submitPost
  };
}