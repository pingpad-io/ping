"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { uri } from "@lens-protocol/client";
import { setAccountMetadata } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { account, MetadataAttributeType } from "@lens-protocol/metadata";
import { ImageIcon, Loader2, Lock, Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import type { User } from "~/lib/types/user";
import { getLensClient } from "~/utils/lens/getLensClient";
import { storageClient } from "~/utils/lens/storage";
import { AvatarViewer } from "./AvatarViewer";

const socialPlatforms = [
  { value: "x", label: "X", placeholder: "username", prefix: "x.com/" },
  { value: "website", label: "Website", placeholder: "example.com", prefix: "https://" },
  { value: "telegram", label: "Telegram", placeholder: "username", prefix: "@" },
  { value: "discord", label: "Discord", placeholder: "username", prefix: "@" },
  { value: "instagram", label: "Instagram", placeholder: "username", prefix: "instagram.com/" },
  { value: "tiktok", label: "TikTok", placeholder: "username", prefix: "tiktok.com/" },
  { value: "youtube", label: "YouTube", placeholder: "username", prefix: "youtube.com/" },
  { value: "twitch", label: "Twitch", placeholder: "username", prefix: "twitch.tv/" },
  { value: "facebook", label: "Facebook", placeholder: "username", prefix: "facebook.com/" },
  { value: "linkedin", label: "LinkedIn", placeholder: "username", prefix: "linkedin.com/" },
  { value: "pinterest", label: "Pinterest", placeholder: "username", prefix: "pinterest.com/" },
  { value: "reddit", label: "Reddit", placeholder: "username", prefix: "reddit.com/" },
  { value: "snapchat", label: "Snapchat", placeholder: "username", prefix: "snapchat.com/" },
  { value: "spotify", label: "Spotify", placeholder: "username", prefix: "spotify.com/" },
  { value: "tiktok", label: "TikTok", placeholder: "username", prefix: "tiktok.com/" },
  { value: "twitch", label: "Twitch", placeholder: "username", prefix: "twitch.tv/" },
  { value: "bluesky", label: "Bluesky", placeholder: "username", prefix: "bsky.app/" },
];

const FormSchema = z.object({
  bio: z
    .string()
    .max(300, {
      message: "Bio must not exceed 300 characters.",
    })
    .optional(),
  socialLinks: z
    .array(
      z.object({
        id: z.string(),
        platform: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
});

interface EditProfileModalProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

function SocialLinkInput({
  platform,
  value,
  onChange,
}: {
  platform?: (typeof socialPlatforms)[0];
  value: string;
  onChange: (value: string) => void;
}) {
  const [paddingLeft, setPaddingLeft] = useState("0.5rem");
  const prefixRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefixRef.current && platform?.prefix) {
      const width = prefixRef.current.offsetWidth;
      setPaddingLeft(`${width + 16}px`);
    } else {
      setPaddingLeft("0.5rem");
    }
  }, [platform?.prefix]);

  return (
    <div className="flex-1 relative flex items-center">
      {platform?.prefix && (
        <span
          ref={prefixRef}
          className="absolute left-2 text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded z-10"
        >
          {platform.prefix}
        </span>
      )}
      <Input
        placeholder={platform?.placeholder || "Value"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ paddingLeft }}
      />
    </div>
  );
}

export function EditProfileModal({ user, open, onOpenChange, onSuccess }: EditProfileModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const { data: walletClient } = useWalletClient();
  const profilePictureInputId = useId();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      bio: user.description || "",
      socialLinks: [],
    },
  });

  const socialLinks = form.watch("socialLinks") || [];

  useEffect(() => {
    if (open) {
      const existingSocialLinks = [];
      if (user.metadata?.attributes) {
        for (const attr of user.metadata.attributes) {
          const platform = socialPlatforms.find((p) => p.value === attr.key);
          if (platform) {
            let value = attr.value;
            if (attr.key === "website" && value.startsWith("https://")) {
              value = value.replace("https://", "");
            } else if (attr.key === "x" && value.startsWith("https://x.com/")) {
              value = value.replace("https://x.com/", "");
            } else if (attr.key === "telegram" && value.startsWith("@")) {
              value = value.substring(1);
            }

            existingSocialLinks.push({
              id: `existing-${attr.key}`,
              platform: attr.key,
              value: value,
            });
          }
        }
      }

      form.reset({
        bio: user.description || "",
        socialLinks: existingSocialLinks,
      });
      setProfilePicture(null);
      setProfilePicturePreview(null);
    }
  }, [open, user, form]);

  const addSocialLink = () => {
    const currentLinks = form.getValues("socialLinks") || [];
    form.setValue("socialLinks", [...currentLinks, { id: Date.now().toString(), platform: "", value: "" }]);
  };

  const removeSocialLink = (index: number) => {
    const currentLinks = form.getValues("socialLinks") || [];
    form.setValue(
      "socialLinks",
      currentLinks.filter((_, i) => i !== index),
    );
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error("Image must be less than 8MB");
        return;
      }
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatSocialValue = (platform: string, value: string): string => {
    const platformConfig = socialPlatforms.find((p) => p.value === platform);
    if (!platformConfig) return value;

    if (platform === "website") {
      const cleanValue = value.replace(/^https?:\/\//, "");
      return cleanValue;
    }

    if (platform === "x") {
      return value.replace(/^@/, "");
    }

    return value;
  };

  const getSocialLinkWithPrefix = (platform: string, value: string): string => {
    const platformConfig = socialPlatforms.find((p) => p.value === platform);
    if (!platformConfig) return value;

    if (platform === "website" && value && !value.startsWith("http")) {
      return `https://${value}`;
    }
    if (platform === "x" && value) {
      return `https://x.com/${value}`;
    }
    if (platform === "telegram" && value) {
      return value.startsWith("@") ? value : `@${value}`;
    }

    return value;
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!walletClient) {
      toast.error("Please connect your wallet");
      return;
    }

    setIsSubmitting(true);
    onOpenChange(false);
    const toastId = Math.random().toString();

    try {
      const client = await getLensClient();

      if (!client || !client.isSessionClient()) {
        toast.error("Not authenticated", { id: toastId });
        setIsSubmitting(false);
        return;
      }

      toast.loading("Preparing profile update...", { id: toastId });

      let pictureUri = user.profilePictureUrl;

      if (profilePicture) {
        toast.loading("Uploading profile picture...", { id: toastId });
        const { uri } = await storageClient.uploadFile(profilePicture);
        pictureUri = uri;
      }

      const attributes = [];

      if (data.socialLinks) {
        for (const link of data.socialLinks) {
          if (link.platform && link.value) {
            const formattedValue = getSocialLinkWithPrefix(link.platform, link.value);
            attributes.push({
              key: link.platform,
              type: MetadataAttributeType.STRING,
              value: formattedValue,
            });
          }
        }
      }

      const metadata = account({
        name: user.name || user.handle,
        bio: data.bio || undefined,
        picture: pictureUri || undefined,
        attributes: attributes.length > 0 ? attributes : undefined,
      });

      toast.loading("Uploading metadata...", { id: toastId });

      const metadataFile = new File([JSON.stringify(metadata)], "metadata.json", { type: "application/json" });
      const { uri: metadataUri } = await storageClient.uploadFile(metadataFile);

      toast.loading("Updating profile...", { id: toastId });

      const result = await setAccountMetadata(client, {
        metadataUri: uri(metadataUri),
      })
        .andThen(handleOperationWith(walletClient))
        .andThen(client.waitForTransaction);

      if (result.isOk()) {
        toast.success("Profile updated successfully!", { id: toastId });
        onSuccess?.();
        form.reset();
        setProfilePicture(null);
        setProfilePicturePreview(null);
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information and social links.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20">
                  {profilePicturePreview ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={profilePicturePreview}
                        alt="Profile preview"
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <AvatarViewer user={user} />
                  )}
                </div>
                <label
                  htmlFor={profilePictureInputId}
                  className="absolute bottom-0 right-0 p-1 bg-background border rounded-full cursor-pointer hover:bg-accent"
                >
                  <ImageIcon className="h-4 w-4" />
                  <input
                    id={profilePictureInputId}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                </label>
              </div>

              <div className="flex-1">
                <FormLabel>Username</FormLabel>
                <div className="relative">
                  <Input value={user.handle} disabled className="pr-10" />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about yourself..." className="resize-none" rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Social Links</h3>
                <Button type="button" variant="outline" size="sm" onClick={addSocialLink} className="h-7 px-2">
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>

              {socialLinks.map((link, index) => {
                const platform = socialPlatforms.find((p) => p.value === link.platform);

                return (
                  <div key={link.id} className="flex gap-2">
                    <Select
                      value={link.platform}
                      onValueChange={(value: string) => {
                        const currentLinks = form.getValues("socialLinks") || [];
                        currentLinks[index] = { ...currentLinks[index], platform: value };
                        form.setValue("socialLinks", currentLinks);
                      }}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {socialPlatforms.map((platform) => (
                          <SelectItem key={platform.value} value={platform.value}>
                            {platform.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <SocialLinkInput
                      platform={platform}
                      value={formatSocialValue(link.platform, link.value)}
                      onChange={(value) => {
                        const currentLinks = form.getValues("socialLinks") || [];
                        currentLinks[index] = { ...currentLinks[index], value };
                        form.setValue("socialLinks", currentLinks);
                      }}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSocialLink(index)}
                      className="h-9 w-9"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
