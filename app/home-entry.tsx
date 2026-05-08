"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ShellTopNav } from "@/components/shell-top-nav";
import { roomConfigMap, type RoomId } from "@/app/room/room-config";
import { FirstLaunchFlow } from "./first-launch-flow";
import styles from "./home-page.module.css";
import {
  getWeakLandingRoomIdFromPreset,
  getWeakLandingRoomIdFromTheme,
  readGeneratedPersonalRoomRecord,
  readHasCompletedFirstLaunchFlow,
  readPostOnboardingSessionPreset,
  type PostOnboardingSessionPreset,
} from "@/lib/first-launch";
import { readLastEnteredRoomId, readStoredRoomId } from "@/lib/room-selection";

type HomeSnapshot = {
  hasCompletedFlow: boolean;
  preset: PostOnboardingSessionPreset | null;
  primaryRoomId: RoomId | null;
};

type HomeRecommendationView = {
  sourceLabel: string;
  title: string;
  body: string;
  ctaLabel: string;
  href: "/room";
  continuityLine: string;
};

function deriveHomeRecommendation(
  snapshot: HomeSnapshot,
): HomeRecommendationView {
  if (snapshot.preset?.status === "active") {
    const roomLabel = snapshot.primaryRoomId
      ? roomConfigMap[snapshot.primaryRoomId].title
      : "Room";

    return {
      sourceLabel: "active onboarding preset",
      title: "Continue to Room",
      body: `Your first-night setup is still active. Go back through ${roomLabel} before anything else.`,
      ctaLabel: "Continue to Room",
      href: "/room",
      continuityLine:
        "Home stays quiet here so it does not interrupt the first-night Room to Talk path.",
    };
  }

  if (snapshot.primaryRoomId) {
    const room = roomConfigMap[snapshot.primaryRoomId];

    return {
      sourceLabel: "system_default",
      title: `Enter ${room.title}`,
      body: "Stage 3 Home should hand you one clear next step, not a dashboard of competing choices.",
      ctaLabel: "Enter Room",
      href: "/room",
      continuityLine: `${room.title} remains the calmest way back into tonight's flow from Home.`,
    };
  }

  return {
    sourceLabel: "system_default",
    title: "Enter Room",
    body: "When no stronger source is available yet, Home should still offer one clear route forward.",
    ctaLabel: "Enter Room",
    href: "/room",
    continuityLine:
      "This is a quiet default entry, not a feed, recap, or analytics surface.",
  };
}

function HomeLoadingState() {
  return (
    <section className={styles.page}>
      <div className={styles.backdropBase} aria-hidden="true" />
      <div className={styles.backdropGlow} aria-hidden="true" />
      <div className={styles.backdropWarmth} aria-hidden="true" />
      <div className={styles.backdropVignette} aria-hidden="true" />

      <header className={styles.topBand}>
        <ShellTopNav />
      </header>

      <main className={styles.scrollContent}>
        <div className={styles.contentColumn}>
          <div className={styles.introChrome} aria-hidden="true">
            <span className={styles.introText}>Quiet entry</span>
            <span className={styles.introDivider} />
            <span className={styles.introText}>Restoring context</span>
          </div>

          <section className={styles.heroBlock}>
            <div className={styles.heroGlow} aria-hidden="true" />
            <p className={styles.heroEyebrow}>Home</p>
            <h1 className={styles.heroTitle}>Preparing tonight&apos;s next step.</h1>
            <p className={styles.heroSupport}>
              Keeping the surface light while Home restores the smallest safe recommendation.
            </p>
          </section>
        </div>
      </main>
    </section>
  );
}

function HomeSurface({ snapshot }: { snapshot: HomeSnapshot }) {
  const recommendation = deriveHomeRecommendation(snapshot);
  const roomName = snapshot.primaryRoomId
    ? roomConfigMap[snapshot.primaryRoomId].title
    : "Room";

  return (
    <section className={styles.page}>
      <div className={styles.backdropBase} aria-hidden="true" />
      <div className={styles.backdropGlow} aria-hidden="true" />
      <div className={styles.backdropWarmth} aria-hidden="true" />
      <div className={styles.backdropVignette} aria-hidden="true" />

      <header className={styles.topBand}>
        <ShellTopNav />
      </header>

      <main className={styles.scrollContent}>
        <div className={styles.contentColumn}>
          <div className={styles.introChrome}>
            <span className={styles.introText}>Quiet entry</span>
            <span className={styles.introDivider} aria-hidden="true" />
            <span className={styles.introText}>{recommendation.sourceLabel}</span>
          </div>

          <section className={styles.heroBlock}>
            <div className={styles.heroGlow} aria-hidden="true" />
            <p className={styles.heroEyebrow}>Home</p>
            <h1 className={styles.heroTitle}>One gentle next step for tonight.</h1>
            <p className={styles.heroSupport}>
              Stage 3 Home is a lightweight default entry. It should guide you forward without becoming a feed, recap, or analytics screen.
            </p>
          </section>

          <section className={styles.recommendationCard}>
            <div className={styles.cardAccent} aria-hidden="true" />

            <div className={styles.cardHeader}>
              <div>
                <p className={styles.cardEyebrow}>Main recommendation</p>
                <h2 className={styles.cardTitle}>{recommendation.title}</h2>
              </div>
              <span className={styles.cardPill}>{roomName}</span>
            </div>

            <p className={styles.cardBody}>{recommendation.body}</p>
            <p className={styles.cardHint}>{recommendation.continuityLine}</p>

            <div className={styles.actionGroup}>
              <Link href={recommendation.href} className={styles.primaryAction}>
                {recommendation.ctaLabel}
              </Link>
            </div>
          </section>

          <section className={styles.notesCard}>
            <p className={styles.notesEyebrow}>Boundary</p>
            <p className={styles.notesText}>
              Home keeps the recommendation singular. Talk, Memory, and Sleep stay available through the shell, but they do not compete with the main CTA here.
            </p>
          </section>
        </div>
      </main>
    </section>
  );
}

export function HomeEntry() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [snapshot, setSnapshot] = useState<HomeSnapshot>({
    hasCompletedFlow: false,
    preset: null,
    primaryRoomId: null,
  });

  useEffect(() => {
    try {
      const preset = readPostOnboardingSessionPreset();
      const generatedRoom = readGeneratedPersonalRoomRecord();
      const primaryRoomId =
        readLastEnteredRoomId() ??
        readStoredRoomId() ??
        getWeakLandingRoomIdFromTheme(generatedRoom?.visual_theme) ??
        getWeakLandingRoomIdFromPreset(preset) ??
        null;

      setSnapshot({
        hasCompletedFlow: readHasCompletedFirstLaunchFlow(),
        preset,
        primaryRoomId,
      });
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const shouldShowHome = useMemo(
    () => isHydrated && snapshot.hasCompletedFlow,
    [isHydrated, snapshot.hasCompletedFlow],
  );

  if (!isHydrated) {
    return <HomeLoadingState />;
  }

  if (!shouldShowHome) {
    return <FirstLaunchFlow />;
  }

  return <HomeSurface snapshot={snapshot} />;
}
