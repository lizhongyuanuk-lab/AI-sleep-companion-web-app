"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readAppEntrySnapshot, type AppEntryTarget } from "./app-entry-state";
import { FirstLaunchFlow } from "./first-launch-flow";
import { HomeLoadingState } from "./home-entry";

export function OnboardingEntry() {
  const router = useRouter();
  const [resolvedTarget, setResolvedTarget] = useState<AppEntryTarget | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get("reset-first-launch") === "1") {
      startTransition(() => {
        setResolvedTarget("/onboarding");
      });
      return;
    }

    const snapshot = readAppEntrySnapshot();
    startTransition(() => {
      setResolvedTarget(snapshot.target);
    });

    if (snapshot.target !== "/onboarding") {
      startTransition(() => {
        router.replace(snapshot.target);
      });
    }
  }, [router]);

  if (resolvedTarget !== "/onboarding") {
    return (
      <HomeLoadingState
        eyebrow="Onboarding"
        title="Preparing your entry."
        support="Returning you to the route that still owns the current flow."
      />
    );
  }

  return <FirstLaunchFlow />;
}
