"use client";

import { SessionClient } from "@lens-protocol/client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { env } from "~/env.mjs";
import { getPublicClient } from "~/utils/lens/getLensClient";
import { LoadingSpinner } from "../LoadingSpinner";
import OnboardingProfileStep from "./OnboardingProfileStep";
import OnboardingUsernameStep from "./OnboardingUsernameStep";

let isGloballyInitializing = false;

export default function OnboardingModal() {
  const router = useRouter();
  const { address: walletAddress, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [currentStep, setCurrentStep] = useState<"username" | "profile">("username");
  const [username, setUsername] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [onboardingClient, setOnboardingClient] = useState<SessionClient | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const hasInitialized = useRef(false);
  const [isWalletReady, setIsWalletReady] = useState(false);
  const [isWaitingForSignature, setIsWaitingForSignature] = useState(false);

  useEffect(() => {
    if (isConnected && walletAddress && signMessageAsync) {
      const timer = setTimeout(() => {
        setIsWalletReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isConnected, walletAddress, signMessageAsync]);

  useEffect(() => {
    let isCancelled = false;

    const initializeOnboardingSession = async () => {
      if (onboardingClient || !walletAddress || !isWalletReady) {
        if (!walletAddress && isWalletReady) {
          setIsInitializing(false);
          setInitError("No wallet connected");
        }
        return;
      }

      if (isGloballyInitializing) {
        return;
      }

      isGloballyInitializing = true;

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
            if (isCancelled) throw new Error("Cancelled");
            return await signMessageAsync({
              account: walletAddress as `0x${string}`,
              message,
            });
          },
        });

        setIsWaitingForSignature(false);

        if (isCancelled) return;

        if (sessionClient.isErr()) {
          throw new Error(sessionClient.error.message);
        }

        setOnboardingClient(sessionClient.value);
      } catch (error: any) {
        if (isCancelled || error?.message === "Cancelled") return;

        console.error("Error initializing onboarding session:", error);

        // Check if user rejected the signature
        if (error?.message?.includes("User rejected") || error?.message?.includes("user rejected")) {
          setInitError("Please sign the message to continue");
        } else {
          setInitError("Failed to initialize onboarding. Please try again.");
        }
        setIsWaitingForSignature(false);
      } finally {
        if (!isCancelled) {
          setIsInitializing(false);
          isGloballyInitializing = false;
        }
      }
    };

    if (isWalletReady && walletAddress && !onboardingClient) {
      initializeOnboardingSession();
    }

    return () => {
      isCancelled = true;
    };
  }, [walletAddress, onboardingClient, isWalletReady]); // Include isWalletReady

  const handleUsernameNext = (selectedUsername: string) => {
    setUsername(selectedUsername);
    setCurrentStep("profile");
  };

  const handleManualInit = async () => {
    setIsInitializing(true);
    setInitError(null);
    setIsWaitingForSignature(false);
    isGloballyInitializing = false;

    if (!walletAddress) {
      setInitError("Please connect your wallet first");
      setIsInitializing(false);
      return;
    }

    // Directly call the initialization function
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
    } catch (error: any) {
      console.error("Error initializing onboarding session:", error);
      
      // Check if user rejected the signature
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

  const handleBack = () => {
    if (currentStep === "profile") {
      setCurrentStep("username");
    } else {
      router.push("/");
    }
  };

  const handleComplete = () => {
    router.push(`/u/${username}`);
    window.location.reload();
  };

  if (isInitializing && !initError) {
    return (
      <Card className="w-full max-w-md mx-4 p-0 overflow-hidden">
        <div className="flex items-center justify-center h-96">
          {isWaitingForSignature ? (
            <div className="text-center gap-2 flex flex-col p-8">
              <h3 className="text-lg font-semibold">Sign in to create your profile</h3>
              <p className="text-sm -mt-2 text-muted-foreground">
                This signature verifies you own this wallet address.
              </p>
              <LoadingSpinner className="w-4 h-15 mx-auto mt-8" />
            </div>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </Card>
    );
  }

  if (initError || !onboardingClient) {
    return (
      <Card className="w-full max-w-md mx-4 p-0 overflow-hidden">
        <div className="p-8 space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Welcome to Ping</h2>
            <p className="text-muted-foreground">Sign in with your wallet to create your profile</p>
          </div>


          <div className="space-y-3">
            <Button onClick={() => router.push("/")} variant="ghost" className="w-full">
              Cancel
            </Button>


            <Button onClick={handleManualInit} className="w-full" size="lg">
              Sign in with wallet
            </Button>

            {initError && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">{initError}</div>
            )}
          </div>

        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-4 p-0 overflow-hidden">
      <div className="relative">
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="icon" onClick={handleBack} disabled={isCreating}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {currentStep === "username" ? "Choose your username" : "Set up your profile"}
          </h2>
          <div className="w-10" />
        </div>

        <div className="flex gap-2 px-4 py-2">
          <div
            className={`h-1 flex-1 rounded-full transition-colors ${currentStep === "username" ? "bg-primary" : "bg-primary"
              }`}
          />
          <div
            className={`h-1 flex-1 rounded-full transition-colors ${currentStep === "profile" ? "bg-primary" : "bg-muted"
              }`}
          />
        </div>

        <div className="p-6">
          {currentStep === "username" ? (
            <OnboardingUsernameStep onNext={handleUsernameNext} isCreating={isCreating} client={onboardingClient} />
          ) : (
            <OnboardingProfileStep
              username={username}
              onComplete={handleComplete}
              onCreating={setIsCreating}
              client={onboardingClient}
            />
          )}
        </div>
      </div>
    </Card>
  );
}
