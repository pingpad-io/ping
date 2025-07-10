import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { MediaImageMimeType } from "@lens-protocol/metadata";
import { 
  normalizeImageMimeType, 
  normalizeVideoMimeType,
  castToMediaImageType
} from "~/utils/mimeTypes";
import { storageClient } from "~/utils/lens/storage";
import type { Post } from "~/components/post/Post";

// Constants
export const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

export type MediaItem = 
  | { type: 'file'; file: File; id: string; isPrimary?: boolean }
  | { type: 'url'; url: string; mimeType: string; id: string; isPrimary?: boolean };

interface ProcessedMedia {
  uri: string;
  type: string;
  isPrimary?: boolean;
}

interface MediaProcessingResult {
  primaryMedia: ProcessedMedia | null;
  attachments: Array<{ item: string; type: MediaImageMimeType }> | undefined;
}

export function useMediaProcessing() {
  const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([]);

  // Initialize media from existing post
  const loadExistingMedia = useCallback((editingPost?: Post) => {
    if (!editingPost?.metadata) return [];
    
    const existingMedia: MediaItem[] = [];
    const metadata = editingPost.metadata;
    
    // Extract primary media
    if (metadata.__typename === "ImageMetadata" && metadata.image?.item) {
      existingMedia.push({
        type: 'url',
        url: metadata.image.item,
        mimeType: normalizeImageMimeType(metadata.image.type) || 'image/jpeg',
        id: `existing-primary-${Date.now()}`,
        isPrimary: true
      });
    } else if (metadata.__typename === "VideoMetadata" && metadata.video?.item) {
      existingMedia.push({
        type: 'url',
        url: metadata.video.item,
        mimeType: normalizeVideoMimeType(metadata.video.type) || 'video/mp4',
        id: `existing-primary-${Date.now()}`,
        isPrimary: true
      });
    }
    
    // Extract attachments
    if (metadata.attachments && Array.isArray(metadata.attachments)) {
      metadata.attachments.forEach((att: { item?: string; type?: string }, index: number) => {
        if (att.item && att.type) {
          // Normalize the MIME type based on whether it's an image or video
          let normalizedType = att.type;
          if (att.type.includes('IMAGE') || att.type.includes('image')) {
            normalizedType = normalizeImageMimeType(att.type) || att.type;
          } else if (att.type.includes('VIDEO') || att.type.includes('video')) {
            normalizedType = normalizeVideoMimeType(att.type) || att.type;
          }
          
          existingMedia.push({
            type: 'url',
            url: att.item,
            mimeType: normalizedType,
            id: `existing-attachment-${index}-${Date.now()}`,
            isPrimary: false
          });
        }
      });
    }
    
    return existingMedia;
  }, []);

  // Add new files
  const handleAddFiles = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is too large. Maximum file size is 8MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const newFiles: MediaItem[] = validFiles.map((file) => ({
        type: 'file',
        file,
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        isPrimary: false // New files are not primary by default
      }));
      setMediaFiles((prev) => [...prev, ...newFiles]);
    }
  }, []);

  // Remove media item
  const removeMedia = useCallback((id: string) => {
    setMediaFiles((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Reorder media items
  const reorderMedia = useCallback((from: number, to: number) => {
    setMediaFiles((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(from, 1);
      result.splice(to, 0, removed);
      return result;
    });
  }, []);

  // Process media for submission
  const processMediaForSubmission = useCallback(async (toastId?: string): Promise<MediaProcessingResult> => {
    if (mediaFiles.length === 0) {
      return { primaryMedia: null, attachments: undefined };
    }

    // Separate new files from existing URLs
    const newFiles = mediaFiles.filter(item => item.type === 'file');
    
    // Upload only new files
    let uploadedFiles: Array<{ uri: string; type: string }> = [];
    if (newFiles.length > 0) {
      if (toastId) {
        toast.loading("Uploading media files...", { id: toastId });
      }
      uploadedFiles = await Promise.all(
        newFiles.map(async (item) => {
          if (item.type === 'file') {
            const { uri } = await storageClient.uploadFile(item.file);
            return { uri, type: item.file.type };
          }
          return { uri: '', type: '' }; // This should never happen due to filter
        }),
      );
    }
    
    const allMedia = mediaFiles.map((item, index) => {
      if (item.type === 'url') {
        return { uri: item.url, type: item.mimeType, isPrimary: item.isPrimary };
      } else {
        const fileIndex = newFiles.findIndex(f => f.id === item.id);
        // New files are primary if they're the first item and no existing primary exists
        const isNewPrimary = index === 0 && !mediaFiles.some(m => m.isPrimary);
        return uploadedFiles[fileIndex] 
          ? { ...uploadedFiles[fileIndex], isPrimary: isNewPrimary } 
          : { uri: '', type: '', isPrimary: false };
      }
    }).filter(m => m.uri !== '');

    // Find the primary media (or use the first if none marked as primary)
    const primaryMedia = allMedia.find(m => m.isPrimary) || allMedia[0];
    
    // Get all non-primary media as potential attachments
    // Use uri comparison instead of object reference comparison
    const nonPrimaryMedia = allMedia.filter(m => m.uri !== primaryMedia?.uri);
    
    // For image and video posts, only image attachments are allowed
    const imageAttachments = nonPrimaryMedia
      .filter((f) => {
        // Normalize the type before checking if it's an image
        const normalizedType = normalizeImageMimeType(f.type) || normalizeVideoMimeType(f.type) || f.type;
        return normalizedType.startsWith("image/");
      })
      .map((f) => ({
        item: f.uri,
        type: castToMediaImageType(f.type),
      }));
    
    const attachments = imageAttachments.length > 0 ? imageAttachments : undefined;

    return { primaryMedia, attachments };
  }, [mediaFiles]);

  // Clear all media
  const clearMedia = useCallback(() => {
    setMediaFiles([]);
  }, []);

  return {
    mediaFiles,
    setMediaFiles,
    loadExistingMedia,
    handleAddFiles,
    removeMedia,
    reorderMedia,
    processMediaForSubmission,
    clearMedia
  };
}