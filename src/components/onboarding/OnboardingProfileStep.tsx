"use client";

import { SessionClient } from "@lens-protocol/client";
import { createAccountWithUsername, fetchAccount } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { account as accountMetadataBuilder } from "@lens-protocol/metadata";
import { Loader2, Upload, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAccount, useSignTypedData, useWalletClient } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { storageClient } from "~/utils/lens/storage";

interface OnboardingProfileStepProps {
  username: string;
  onComplete: () => void;
  onCreating: (isCreating: boolean) => void;
  client: SessionClient;
}

export default function OnboardingProfileStep({
  username,
  onComplete,
  onCreating,
  client,
}: OnboardingProfileStepProps) {
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const { data: walletClient } = useWalletClient();

  const [displayName, setDisplayName] = useState(username);
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast.error("Image must be less than 8MB");
        return;
      }

      setProfilePicture(file);
      const url = URL.createObjectURL(file);
      setProfilePictureUrl(url);
    }
  };

  const handleCreateProfile = async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    setIsCreating(true);
    onCreating(true);

    try {
      let pictureUri: string | undefined;
      if (profilePicture) {
        const { uri } = await storageClient.uploadFile(profilePicture);
        pictureUri = uri;
      }

      const metadata = accountMetadataBuilder({
        name: displayName,
        bio: bio || undefined,
        picture: pictureUri,
      });

      const { uri: metadataUri } = await storageClient.uploadAsJson(metadata);

      const result = await createAccountWithUsername(client, {
        username: {
          localName: username.toLowerCase(),
        },
        metadataUri: metadataUri,
      })
        .andThen(handleOperationWith(walletClient as any))
        .andThen(client.waitForTransaction)
        .andThen((txHash) => {
          console.log("Transaction hash:", txHash);
          return fetchAccount(client!, { txHash });
        })
        .andThen((account) => {
          if (!account) throw new Error("Account not found");
          console.log("Account created:", account);
          if (client?.isSessionClient()) {
            return client.switchAccount({
              account: account.address,
            });
          }
          throw new Error("Client is not a session client");
        });

      if (result.isErr()) {
        throw new Error(typeof result.error === "string" ? result.error : "Failed to complete account setup");
      }

      toast.success("Profile created successfully!");

      const credentials = await client.getCredentials();

      if (credentials.isErr()) {
        throw new Error("Failed to get credentials");
      }

      const refreshToken = credentials.value?.refreshToken;
      if (!refreshToken) {
        throw new Error("Failed to get refresh token");
      }

      const authResponse = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!authResponse.ok) {
        throw new Error("Failed to set up authentication");
      }

      onComplete();
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("Failed to create profile. Please try again.");
    } finally {
      setIsCreating(false);
      onCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profilePictureUrl || undefined} />
          <AvatarFallback>
            <User className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>

        <Label htmlFor="picture" className="cursor-pointer">
          <div className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors">
            <Upload className="h-4 w-4" />
            Upload profile picture
          </div>
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isCreating}
          />
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your display name"
          disabled={isCreating}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio (optional)</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          rows={3}
          disabled={isCreating}
        />
      </div>

      <Button onClick={handleCreateProfile} disabled={isCreating || !displayName} className="w-full">
        {isCreating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating profile...
          </>
        ) : (
          "Create Profile"
        )}
      </Button>
    </div>
  );
}
