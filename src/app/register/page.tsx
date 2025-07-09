"use client";

import { SessionClient } from "@lens-protocol/client";
import { canCreateUsername, createAccountWithUsername, fetchAccount } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { account as accountMetadataBuilder } from "@lens-protocol/metadata";
import { Check, ChevronLeftIcon, Loader2, Upload, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount, useSignMessage, useWalletClient } from "wagmi";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { env } from "~/env.mjs";
import { useDebounce } from "~/hooks/useDebounce";
import { getPublicClient } from "~/utils/lens/getLensClient";
import { storageClient } from "~/utils/lens/storage";

let isGloballyInitializing = false;

export default function RegisterPage() {
  const router = useRouter();
  const { address: walletAddress, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { data: walletClient } = useWalletClient();

  const [currentStep, setCurrentStep] = useState<"signin" | "username" | "profile">("signin");
  const [username, setUsername] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [onboardingClient, setOnboardingClient] = useState<SessionClient | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [isWalletReady, setIsWalletReady] = useState(false);
  const [isWaitingForSignature, setIsWaitingForSignature] = useState(false);

  // Username step state
  const [usernameInput, setUsernameInput] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debouncedUsername = useDebounce(usernameInput, 500);

  // Profile step state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && walletAddress && signMessageAsync) {
      const timer = setTimeout(() => {
        setIsWalletReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isConnected, walletAddress, signMessageAsync]);

  const initializeOnboardingSession = async () => {
    if (onboardingClient || !walletAddress || !isWalletReady) {
      if (!walletAddress && isWalletReady) {
        setInitError("No wallet connected");
      }
      return;
    }

    if (isGloballyInitializing) {
      return;
    }

    isGloballyInitializing = true;
    setIsInitializing(true);
    setInitError(null);

    try {
      const client = getPublicClient();
      const appAddress =
        env.NEXT_PUBLIC_NODE_ENV === "development"
          ? env.NEXT_PUBLIC_APP_ADDRESS_TESTNET
          : env.NEXT_PUBLIC_APP_ADDRESS;

      setIsWaitingForSignature(true);

      const sessionClient = await client.login({
        onboardingUser: {
          app: appAddress || "0x30d66188F860374cF8AC8A4354E7f537532ed13b",
          wallet: walletAddress,
        },
        signMessage: async (message: string) => {
          return await signMessageAsync({
            account: walletAddress as `0x${string}`,
            message,
          });
        },
      });

      setIsWaitingForSignature(false);

      if (sessionClient.isErr()) {
        throw new Error(sessionClient.error.message);
      }

      setOnboardingClient(sessionClient.value);
      setCurrentStep("username");
    } catch (error: any) {
      console.error("Error initializing onboarding session:", error);

      if (error?.message?.includes("User rejected") || error?.message?.includes("user rejected")) {
        setInitError("Please sign the message to continue");
      } else {
        setInitError("Failed to initialize onboarding. Please try again.");
      }
      setIsWaitingForSignature(false);
    } finally {
      setIsInitializing(false);
      isGloballyInitializing = false;
    }
  };

  const checkUsernameAvailability = useCallback(
    async (handle: string) => {
      if (!handle || handle.length < 3 || !onboardingClient) {
        setIsAvailable(null);
        setError(null);
        return;
      }

      setIsChecking(true);
      setError(null);

      try {
        const result = await canCreateUsername(onboardingClient, {
          localName: handle,
        });

        if (result.isOk()) {
          const data = result.value;
          switch (data.__typename) {
            case "NamespaceOperationValidationPassed":
              setIsAvailable(true);
              break;
            case "NamespaceOperationValidationFailed":
              setIsAvailable(false);
              setError(data.reason || "Username validation failed");
              break;
            case "NamespaceOperationValidationUnknown":
              setIsAvailable(false);
              setError("Username validation status unknown");
              break;
            default:
              setIsAvailable(false);
              setError("This username is already taken");
          }
        } else {
          setError("Failed to check username availability");
          setIsAvailable(false);
        }
      } catch (err) {
        console.error("Error checking username:", err);
        setError("Failed to check username availability");
        setIsAvailable(false);
      } finally {
        setIsChecking(false);
      }
    },
    [onboardingClient],
  );

  useEffect(() => {
    if (debouncedUsername) {
      checkUsernameAvailability(debouncedUsername);
    }
  }, [debouncedUsername, checkUsernameAvailability]);

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAvailable && usernameInput.length >= 3) {
      setUsername(usernameInput);
      setDisplayName(usernameInput);
      setCurrentStep("profile");
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsernameInput(value);
  };

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
    if (!walletAddress || !onboardingClient) {
      toast.error("Please connect your wallet");
      return;
    }

    setIsCreating(true);

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

      const result = await createAccountWithUsername(onboardingClient, {
        username: {
          localName: username.toLowerCase(),
        },
        metadataUri: metadataUri,
      })
        .andThen(handleOperationWith(walletClient as any))
        .andThen(onboardingClient.waitForTransaction)
        .andThen((txHash) => {
          console.log("Transaction hash:", txHash);
          return fetchAccount(onboardingClient!, { txHash });
        })
        .andThen((account) => {
          if (!account) throw new Error("Account not found");
          console.log("Account created:", account);
          if (onboardingClient?.isSessionClient()) {
            return onboardingClient.switchAccount({
              account: account.address,
            });
          }
          throw new Error("Client is not a session client");
        });

      if (result.isErr()) {
        throw new Error(typeof result.error === "string" ? result.error : "Failed to complete account setup");
      }

      toast.success("Profile created successfully!");

      const credentials = onboardingClient.getCredentials();

      if (credentials.isErr()) {
        throw new Error("Failed to get credentials");
      }

      const refreshToken = credentials.value?.refreshToken;
      if (!refreshToken) {
        throw new Error("Failed to get refresh token");
      }

      const authResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!authResponse.ok) {
        throw new Error("Failed to set up authentication");
      }

      router.push(`/u/${username}`);
      window.location.reload();
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("Failed to create profile. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleBack = () => {
    if (currentStep === "profile") {
      setCurrentStep("username");
    } else if (currentStep === "username") {
      setCurrentStep("signin");
      setOnboardingClient(null);
      setInitError(null);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md mx-4 p-0 overflow-hidden">
        <div className="relative">
          <div className="flex items-center justify-between p-4 border-b">
            <Button variant="ghost" size="icon" onClick={handleBack} disabled={isCreating || isInitializing}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">
              {currentStep === "signin" ? "Let's create a new profile" :
                currentStep === "username" ? "Choose your username" : "Set up your profile"}
            </h2>
            <div className="w-10" />
          </div>

          <div className="flex gap-2 px-4 py-2">
            <div
              className={`h-1 flex-1 rounded-full transition-colors ${currentStep === "signin" ? "bg-primary" : "bg-primary"
                }`}
            />
            <div
              className={`h-1 flex-1 rounded-full transition-colors ${currentStep === "username" ? "bg-primary" : currentStep === "profile" ? "bg-primary" : "bg-muted"
                }`}
            />
            <div
              className={`h-1 flex-1 rounded-full transition-colors ${currentStep === "profile" ? "bg-primary" : "bg-muted"
                }`}
            />
          </div>

          <div className="p-6">
            {currentStep === "signin" ? (
              <div className="space-y-6">
                {isInitializing ? (
                  <div className="space-y-6">
                    {isWaitingForSignature && (
                      <p className="mt-8 text-muted-foreground text-center">
                        This signature verifies you own this wallet address.
                      </p>
                    )}

                    <Button className="w-full items-center flex flex-row gap-2" size="lg" disabled>
                      <LoadingSpinner size={20} />
                      Signing in...
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="mt-8 text-muted-foreground text-center">Sign in with your wallet to begin</p>

                    {initError && (
                      <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-center">{initError}</div>
                    )}

                    <Button onClick={initializeOnboardingSession} className="w-full" size="lg" disabled={!walletAddress}>
                      Sign in
                    </Button>


                    {!walletAddress && (
                      <div className="text-sm text-muted-foreground text-center">
                        Please connect your wallet first
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : currentStep === "username" ? (
              <form onSubmit={handleUsernameSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      type="text"
                      value={usernameInput}
                      onChange={handleUsernameChange}
                      placeholder="myusername"
                      className="pr-10"
                      disabled={isCreating}
                      autoFocus
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {isChecking && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                      {!isChecking && isAvailable === true && <Check className="h-4 w-4 text-green-500" />}
                      {!isChecking && isAvailable === false && <X className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <p className="text-sm text-muted-foreground">
                    Your username must be at least 3 characters long and can only contain lowercase letters, numbers, and
                    underscores.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={!isAvailable || usernameInput.length < 3 || isChecking || isCreating}
                  className="w-full"
                >
                  Continue
                </Button>
              </form>
            ) : (
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
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}