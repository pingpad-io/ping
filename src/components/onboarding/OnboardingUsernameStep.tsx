"use client";

import { SessionClient } from "@lens-protocol/client";
import { canCreateUsername } from "@lens-protocol/client/actions";
import { Check, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useDebounce } from "~/hooks/useDebounce";

interface OnboardingUsernameStepProps {
  onNext: (username: string) => void;
  isCreating: boolean;
  client: SessionClient;
}

export default function OnboardingUsernameStep({ onNext, isCreating, client }: OnboardingUsernameStepProps) {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const debouncedUsername = useDebounce(username, 500);

  const checkUsernameAvailability = useCallback(
    async (handle: string) => {
      if (!handle || handle.length < 3) {
        setIsAvailable(null);
        setError(null);
        return;
      }

      setIsChecking(true);
      setError(null);

      try {
        const result = await canCreateUsername(client, {
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
    [client],
  );

  useEffect(() => {
    if (debouncedUsername) {
      checkUsernameAvailability(debouncedUsername);
    }
  }, [debouncedUsername, checkUsernameAvailability]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAvailable && username.length >= 3) {
      onNext(username);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <Input
            id="username"
            type="text"
            value={username}
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
        disabled={!isAvailable || username.length < 3 || isChecking || isCreating}
        className="w-full"
      >
        Continue
      </Button>
    </form>
  );
}
