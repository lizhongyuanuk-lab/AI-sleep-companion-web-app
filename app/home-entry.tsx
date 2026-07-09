"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ShellTopNav } from "@/components/shell-top-nav";
import { sceneQueryParam } from "@/lib/scene-selection";
import {
  getWeakLandingRoomIdFromPreset,
  getWeakLandingRoomIdFromTheme,
  readGeneratedPersonalRoomRecord,
  readHasCompletedFirstLaunchFlow,
  readPostOnboardingSessionPreset,
  type PostOnboardingSessionPreset,
} from "@/lib/first-launch";
import { readLastEnteredRoomId, readStoredRoomId } from "@/lib/room-selection";
import { roomConfigMap, type RoomId } from "@/app/room/room-config";
import { memoryPageMockData } from "@/app/memory/memory-page-data";
import { FirstLaunchFlow } from "./first-launch-flow";
import styles from "./home-page.module.css";

type HomeSnapshot = {
  hasCompletedFlow: boolean;
  lastEnteredRoomId: RoomId | null;
  suggestedRoomId: RoomId | null;
  preset: PostOnboardingSessionPreset | null;
};

const primaryCtaLabel = "Start tonight's talk";

function buildTalkHref(roomId: RoomId | null) {
  if (!roomId) {
    return "/talk";
  }

  return `/talk?${sceneQueryParam}=${roomConfigMap[roomId].talkSceneId}`;
}

function getContinuityLine({
  preset,
  roomId,
}: {
  preset: PostOnboardingSessionPreset | null;
  roomId: RoomId | null;
}) {
  if (roomId) {
    return `You can return through ${roomConfigMap[roomId].title} tonight.`;
  }

  if (preset?.status === "active") {
    return "Tonight's wind-down path is already set softly.";
  }

  if (preset?.status === "consumed") {
    return "Your companion can pick up gently without replaying everything.";
  }

  return "A quiet place to begin is enough for tonight.";
}

function getHeroCopy({
  hasHistory,
  roomId,
}: {
  hasHistory: boolean;
  roomId: RoomId | null;
}) {
  if (!hasHistory) {
    return {
      title: "A quiet place to begin tonight.",
      support:
        "No dashboard, no recap, and no pressure to organize the night before you start talking.",
    };
  }

  if (roomId) {
    return {
      title: `Come back softly through ${roomConfigMap[roomId].title}.`,
      support:
        "Your companion keeps the evening light here, so returning can feel calm instead of heavy.",
    };
  }

  return {
    title: "Come back softly tonight.",
    support:
      "Home keeps the night simple: a little continuity, a quiet suggestion, and one clear way into Talk.",
  };
}

function getTonightCopy({
  preset,
  roomId,
  hasHistory,
}: {
  preset: PostOnboardingSessionPreset | null;
  roomId: RoomId | null;
  hasHistory: boolean;
}) {
  if (!hasHistory) {
    return {
      title: "Begin with a calm companion check-in.",
      body: "Talk stays the main path here. You can start softly and let the room hold the rest.",
    };
  }

  if (roomId && preset?.status === "consumed") {
    return {
      title: `Start again from ${roomConfigMap[roomId].title}.`,
      body: "You do not need a full recap tonight. A gentle return is enough to keep the rhythm going.",
    };
  }

  if (roomId) {
    return {
      title: `Start tonight from ${roomConfigMap[roomId].title}.`,
      body: "The quickest path is still a sleep-oriented Talk. Home only holds the door open for it.",
    };
  }

  if (preset?.status === "active") {
    return {
      title: "Tonight already has a softer direction.",
      body: "Your companion can carry the quiet pace forward without turning Home into a setup checklist.",
    };
  }

  return {
    title: "Start tonight's Talk without extra setup.",
    body: "Home should feel calm enough to enter and easy enough to leave once you are ready to talk.",
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
            <span className={styles.introChromeText}>Quiet entry</span>
            <span className={styles.introDivider} />
            <span className={styles.introChromeText}>Finding tonight</span>
          </div>

          <section className={styles.heroBlock}>
            <div className={styles.heroGlow} aria-hidden="true" />
            <p className={styles.heroEyebrow}>Home</p>
            <h1 className={styles.heroTitle}>Finding tonight&apos;s quiet entry.</h1>
            <p className={styles.heroSupport}>
              Keeping the shell calm while the page restores your local context.
            </p>
          </section>
        </div>
      </main>
    </section>
  );
}

function HomeSurface({ snapshot }: { snapshot: HomeSnapshot }) {
  const firstVisibleMemory = memoryPageMockData.recurring_topics.find(
    (topic) => !topic.is_deleted,
  );

  const hasHistory =
    snapshot.lastEnteredRoomId !== null ||
    snapshot.suggestedRoomId !== null ||
    snapshot.preset?.status === "consumed" ||
    snapshot.preset?.status === "active";
  const roomId = snapshot.lastEnteredRoomId ?? snapshot.suggestedRoomId;
  const talkHref = buildTalkHref(roomId);
  const heroCopy = getHeroCopy({
    hasHistory,
    roomId,
  });
  const tonightCopy = getTonightCopy({
    preset: snapshot.preset,
    roomId,
    hasHistory,
  });
  const continuityLine = getContinuityLine({
    preset: snapshot.preset,
    roomId,
  });
  const showMemoryPreview = hasHistory && Boolean(firstVisibleMemory);
  const secondaryHref = showMemoryPreview ? "/memory" : "/room";
  const secondaryLabel = showMemoryPreview ? "View Memory" : "Browse rooms";
  const introLabel = roomId ? roomConfigMap[roomId].title : hasHistory ? "Returning night" : "First night";

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
            <span className={styles.introChromeText}>Quiet entry</span>
            <span className={styles.introDivider} aria-hidden="true" />
            <span className={styles.introChromeText}>{introLabel}</span>
          </div>

          <section className={styles.heroBlock}>
            <div className={styles.heroGlow} aria-hidden="true" />
            <p className={styles.heroEyebrow}>Home</p>
            <h1 className={styles.heroTitle}>{heroCopy.title}</h1>
            <p className={styles.heroSupport}>{heroCopy.support}</p>
          </section>

          <section className={styles.bridgeCard}>
            <p className={styles.bridgeEyebrow}>A gentle carry-over</p>
            <p className={styles.bridgeCopy}>{continuityLine}</p>
          </section>

          <section className={styles.tonightCard}>
            <div className={styles.cardAccent} aria-hidden="true" />
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.cardEyebrow}>Tonight</p>
                <h2 className={styles.cardTitle}>{tonightCopy.title}</h2>
              </div>
              {roomId ? (
                <span className={styles.roomPill}>{roomConfigMap[roomId].title}</span>
              ) : null}
            </div>
            <p className={styles.cardBody}>{tonightCopy.body}</p>
            <p className={styles.cardHint}>
              Your companion stays present here, but Home should still hand the night back to Talk.
            </p>
          </section>

          {showMemoryPreview && firstVisibleMemory ? (
            <section className={styles.memoryCard}>
              <p className={styles.memoryEyebrow}>A small continuity cue</p>
              <h2 className={styles.memoryTitle}>{firstVisibleMemory.display_text}</h2>
              <p className={styles.memoryBody}>
                {firstVisibleMemory.continuation_hint ??
                  "A quiet memory can stay visible here without turning Home into memory management."}
              </p>
            </section>
          ) : null}

          <div className={styles.actionGroup}>
            <Link href={talkHref} className={styles.primaryAction}>
              {primaryCtaLabel}
            </Link>
            <Link href={secondaryHref} className={styles.secondaryAction}>
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </main>
    </section>
  );
}

export function HomeEntry() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [snapshot, setSnapshot] = useState<HomeSnapshot>({
    hasCompletedFlow: false,
    lastEnteredRoomId: null,
    suggestedRoomId: null,
    preset: null,
  });

  useEffect(() => {
    try {
      const preset = readPostOnboardingSessionPreset();
      const generatedRoom = readGeneratedPersonalRoomRecord();
      const lastEnteredRoomId = readLastEnteredRoomId();
      const storedRoomId = readStoredRoomId();
      const suggestedRoomId =
        lastEnteredRoomId ??
        storedRoomId ??
        getWeakLandingRoomIdFromTheme(generatedRoom?.visual_theme) ??
        getWeakLandingRoomIdFromPreset(preset) ??
        null;

      setSnapshot({
        hasCompletedFlow: readHasCompletedFirstLaunchFlow(),
        lastEnteredRoomId,
        suggestedRoomId,
        preset,
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
