"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShellTopNav } from "@/components/shell-top-nav";
import { roomConfigMap } from "@/app/room/room-config";
import styles from "./home-page.module.css";
import {
  readAppEntrySnapshot,
  type AppEntrySnapshot,
} from "./app-entry-state";

type HomeRecommendationView = {
  sourceLabel: string;
  heroTitle: string;
  heroSupport: string;
  cueLabel: string;
  cueText: string;
  title: string;
  body: string;
  ctaLabel: string;
  href: "/room";
  cardPill: string;
};

function deriveHomeRecommendation(
  snapshot: AppEntrySnapshot,
): HomeRecommendationView {
  if (snapshot.preset?.status === "expired") {
    return {
      sourceLabel: "Fallback recovery",
      heroTitle: "A calmer way back into tonight.",
      heroSupport:
        "Home appears when the earlier path can no longer continue safely, and the product needs one gentle restart point.",
      cueLabel: "Expired preset",
      cueText:
        "The earlier onboarding preset is no longer safe to resume directly, so Home recovers the next step quietly.",
      title: "Enter Room",
      body: "Return through Room instead of replaying the expired setup. It keeps the recovery path calm and traceable.",
      ctaLabel: "Enter Room",
      href: "/room",
      cardPill: "Recovery",
    };
  }

  if (snapshot.primaryRoomId) {
    const room = roomConfigMap[snapshot.primaryRoomId];

    return {
      sourceLabel: "Normal return",
      heroTitle: "One gentle next step for tonight.",
      heroSupport:
        "Home stays light when the product only needs to hand you the safest path back into the night flow.",
      cueLabel: "Continuation",
      cueText: `${room.title} remains the clearest way back into the companion flow without turning Home into a dashboard.`,
      title: `Enter ${room.title}`,
      body: "Room is still the calmest bridge back into tonight's session, so Home keeps the recommendation singular.",
      ctaLabel: "Enter Room",
      href: "/room",
      cardPill: room.title,
    };
  }

  return {
    sourceLabel: "App default",
    heroTitle: "A quiet place to resume from.",
    heroSupport:
      "When no stronger signal is available, Home still gives one low-stimulation next-best-action instead of empty space.",
    cueLabel: "Quiet recovery",
    cueText:
      "There is no stronger recommendation to surface safely right now, so Home falls back to the simplest continuation path.",
    title: "Enter Room",
    body: "Room remains the safest default continuation when Memory, Sleep, or a stronger recovery cue should not lead the page.",
    ctaLabel: "Enter Room",
    href: "/room",
    cardPill: "Room",
  };
}

export function HomeLoadingState({
  eyebrow = "Home",
  title = "Preparing tonight's next step.",
  support = "Keeping the surface light while the product restores the smallest safe recommendation.",
}: {
  eyebrow?: string;
  title?: string;
  support?: string;
}) {
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
            <p className={styles.heroEyebrow}>{eyebrow}</p>
            <h1 className={styles.heroTitle}>{title}</h1>
            <p className={styles.heroSupport}>{support}</p>
          </section>
        </div>
      </main>
    </section>
  );
}

function HomeSurface({ snapshot }: { snapshot: AppEntrySnapshot }) {
  const recommendation = deriveHomeRecommendation(snapshot);

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
            <span className={styles.introText}>Independent Home</span>
            <span className={styles.introDivider} aria-hidden="true" />
            <span className={styles.introText}>{recommendation.sourceLabel}</span>
          </div>

          <section className={styles.heroBlock}>
            <div className={styles.heroGlow} aria-hidden="true" />
            <p className={styles.heroEyebrow}>Home</p>
            <h1 className={styles.heroTitle}>{recommendation.heroTitle}</h1>
            <p className={styles.heroSupport}>{recommendation.heroSupport}</p>
          </section>

          <section className={styles.continuityCue}>
            <p className={styles.cueEyebrow}>{recommendation.cueLabel}</p>
            <p className={styles.cueText}>{recommendation.cueText}</p>
          </section>

          <section className={styles.recommendationCard}>
            <div className={styles.cardAccent} aria-hidden="true" />

            <div className={styles.cardHeader}>
              <div>
                <p className={styles.cardEyebrow}>Main recommendation</p>
                <h2 className={styles.cardTitle}>{recommendation.title}</h2>
              </div>
              <span className={styles.cardPill}>{recommendation.cardPill}</span>
            </div>

            <p className={styles.cardBody}>{recommendation.body}</p>

            <div className={styles.actionGroup}>
              <Link href={recommendation.href} className={styles.primaryAction}>
                {recommendation.ctaLabel}
              </Link>
              <Link href="/memory" className={styles.secondaryAction}>
                View Memory
              </Link>
            </div>
          </section>
        </div>
      </main>
    </section>
  );
}

export function HomeEntry() {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<AppEntrySnapshot | null>(null);

  useEffect(() => {
    const nextSnapshot = readAppEntrySnapshot();

    if (nextSnapshot.target !== "/home") {
      startTransition(() => {
        router.replace(nextSnapshot.target);
      });
      return;
    }

    startTransition(() => {
      setSnapshot(nextSnapshot);
    });
  }, [router]);

  if (!snapshot) {
    return (
      <HomeLoadingState
        eyebrow="Home"
        title="Preparing a safe next step."
        support="Holding the page quiet while Home confirms it really owns this continuation."
      />
    );
  }

  return <HomeSurface snapshot={snapshot} />;
}
