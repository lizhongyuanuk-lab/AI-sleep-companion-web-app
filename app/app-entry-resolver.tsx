"use client";

import { startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HomeLoadingState } from "./home-entry";
import { readAppEntrySnapshot } from "./app-entry-state";

export function AppEntryResolver() {
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.get("reset-first-launch") === "1") {
      startTransition(() => {
        router.replace("/onboarding?reset-first-launch=1");
      });
      return;
    }

    const snapshot = readAppEntrySnapshot();

    startTransition(() => {
      router.replace(snapshot.target);
    });
  }, [router]);

  return (
    <HomeLoadingState
      eyebrow="Entry"
      title="Finding the safest route in."
      support="Routing you to onboarding, room, or home without turning the entry into another page to decode."
    />
  );
}
