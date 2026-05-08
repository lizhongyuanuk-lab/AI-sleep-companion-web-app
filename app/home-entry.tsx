"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./home-page.module.css";
import {
  readAppEntrySnapshot,
  type AppEntrySnapshot,
} from "./app-entry-state";

type HomeRecommendationView = {
  topLabel: string;
  heroTitle: string;
  body: string;
  ctaLabel: string;
  href: "/onboarding" | "/room" | "/talk";
};

function deriveHomeRecommendation(
  snapshot: AppEntrySnapshot,
): HomeRecommendationView {
  if (snapshot.preset?.status === "expired") {
    return {
      topLabel: "Home",
      heroTitle: "A calmer way back into tonight.",
      body: "The earlier setup has expired, so we’ll restart gently instead of replaying old context.",
      ctaLabel: "Enter Room",
      href: "/room",
    };
  }

  return {
    topLabel: "Home",
    heroTitle: "A quieter way into tonight.",
    body: "Your companion is here when you are ready. Start with a calm talk and let the rest unfold from there.",
    ctaLabel: "Start tonight's talk",
    href: "/talk",
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

      <main className={styles.scrollContent}>
        <div className={styles.contentColumn}>
          <p className={styles.topLabel}>{eyebrow}</p>

          <section className={styles.heroBlock}>
            <div className={styles.heroGlow} aria-hidden="true" />
            <h1 className={styles.heroTitle}>{title}</h1>
            <p className={styles.bodyCopy}>{support}</p>
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

      <main className={styles.scrollContent}>
        <div className={styles.contentColumn}>
          <p className={styles.topLabel}>{recommendation.topLabel}</p>

          <section className={styles.heroBlock}>
            <div className={styles.heroGlow} aria-hidden="true" />
            <h1 className={styles.heroTitle}>{recommendation.heroTitle}</h1>
            <p className={styles.bodyCopy}>{recommendation.body}</p>
            <Link href={recommendation.href} className={styles.primaryAction}>
              {recommendation.ctaLabel}
            </Link>
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
