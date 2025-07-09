"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OnboardingModal from "~/components/onboarding/OnboardingModal";
import { useAuth } from "~/hooks/useAuth";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <OnboardingModal />
    </div>
  );
}
